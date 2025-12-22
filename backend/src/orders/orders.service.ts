import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './dto/update-order-status.dto';

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate unique order number: ORD-YYYYMMDD-XXXXXX
   */
  private generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${dateStr}-${random}`;
  }

  /**
   * Calculate shipping cost based on subtotal
   */
  private calculateShipping(subtotal: number): number {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  }

  /**
   * Create order from cart
   */
  async createOrder(createOrderDto: CreateOrderDto, userId?: string) {
    const { sessionId, shippingAddress } = createOrderDto;

    // Get cart with items - prefer userId if authenticated, fall back to sessionId
    const cartInclude = { items: { include: { product: true } } } as const;

    let cart = userId
      ? await this.prisma.cart.findUnique({
          where: { userId },
          include: cartInclude,
        })
      : null;

    // Fall back to sessionId if no user cart found (guest cart not yet migrated)
    if (!cart && sessionId) {
      cart = await this.prisma.cart.findUnique({
        where: { sessionId },
        include: cartInclude,
      });
    }

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new BadRequestException(
          `Not enough stock for "${item.product.name}". Available: ${item.product.stock}, Requested: ${item.quantity}`,
        );
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    const shippingCost = this.calculateShipping(subtotal);
    const total = subtotal + shippingCost;

    // Generate unique order number
    let orderNumber = this.generateOrderNumber();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await this.prisma.order.findUnique({
        where: { orderNumber },
      });
      if (!existing) break;
      orderNumber = this.generateOrderNumber();
      attempts++;
    }

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          sessionId: userId ? null : sessionId, // Only set sessionId for guest orders
          userId, // Set userId for authenticated users
          status: 'pending',
          shippingName: shippingAddress.name,
          shippingEmail: shippingAddress.email,
          shippingPhone: shippingAddress.phone,
          shippingAddress: shippingAddress.address,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingZipCode: shippingAddress.zipCode,
          shippingCountry: shippingAddress.country || 'USA',
          subtotal,
          shippingCost,
          total,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productPrice: item.product.price,
              quantity: item.quantity,
              subtotal: Number(item.product.price) * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      // Decrement stock for each product
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cart.delete({
        where: { id: cart.id },
      });

      return newOrder;
    });

    return this.formatOrderResponse(order);
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.formatOrderResponse(order);
  }

  /**
   * Lookup orders by email
   */
  async getOrdersByEmail(email: string) {
    const orders = await this.prisma.order.findMany({
      where: { shippingEmail: email },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatOrderResponse(order));
  }

  /**
   * Get orders by user ID (for authenticated users)
   */
  async getOrdersByUser(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatOrderResponse(order));
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // If cancelling, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      await this.prisma.$transaction(async (tx) => {
        const orderWithItems = await tx.order.findUnique({
          where: { id },
          include: { items: true },
        });

        // Restore stock for each item
        for (const item of orderWithItems!.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        // Update order status
        await tx.order.update({
          where: { id },
          data: { status },
        });
      });
    } else {
      await this.prisma.order.update({
        where: { id },
        data: { status },
      });
    }

    return this.getOrderById(id);
  }

  /**
   * Format order for API response
   */
  private formatOrderResponse(order: any) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      sessionId: order.sessionId,
      userId: order.userId,
      status: order.status,
      shippingAddress: {
        name: order.shippingName,
        email: order.shippingEmail,
        phone: order.shippingPhone,
        address: order.shippingAddress,
        city: order.shippingCity,
        state: order.shippingState,
        zipCode: order.shippingZipCode,
        country: order.shippingCountry,
      },
      items: order.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productPrice: Number(item.productPrice),
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
        product: item.product,
      })),
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      total: Number(order.total),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
