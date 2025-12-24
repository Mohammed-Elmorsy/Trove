import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

export interface CartIdentifier {
  sessionId?: string;
  userId?: string;
}

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(sessionId: string, userId?: string) {
    // Prefer userId if authenticated, otherwise use sessionId
    const whereClause = userId ? { userId } : { sessionId };

    const cart = await this.prisma.cart.findFirst({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      return {
        id: null,
        sessionId: userId ? null : sessionId,
        userId: userId || null,
        items: [],
        itemCount: 0,
        subtotal: 0,
      };
    }

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    return {
      id: cart.id,
      sessionId: cart.sessionId,
      userId: cart.userId,
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
      })),
      itemCount,
      subtotal: Math.round(subtotal * 100) / 100,
    };
  }

  async addItem(addToCartDto: AddToCartDto, userId?: string) {
    const { sessionId, productId, quantity } = addToCartDto;

    // Use transaction to prevent race conditions in stock validation
    return await this.prisma.$transaction(async (tx) => {
      // Validate product exists and has sufficient stock
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      // Find or create cart - prefer userId if authenticated
      let cart = userId
        ? await tx.cart.findUnique({ where: { userId } })
        : await tx.cart.findUnique({ where: { sessionId } });

      if (!cart) {
        cart = await tx.cart.create({
          data: userId ? { userId } : { sessionId },
        });
      }

      // Check if item already exists in cart
      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      const newQuantity = existingItem
        ? existingItem.quantity + quantity
        : quantity;

      // Validate stock within transaction
      if (newQuantity > product.stock) {
        throw new BadRequestException(
          `Not enough stock. Available: ${product.stock}, Requested: ${newQuantity}`,
        );
      }

      // Upsert cart item
      const cartItem = await tx.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        update: {
          quantity: newQuantity,
        },
        create: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });

      return {
        id: cartItem.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        product: {
          ...cartItem.product,
          price: Number(cartItem.product.price),
        },
      };
    });
  }

  async updateQuantity(itemId: string, updateCartItemDto: UpdateCartItemDto) {
    const { quantity } = updateCartItemDto;

    // Use transaction to prevent race conditions in stock validation
    return await this.prisma.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findUnique({
        where: { id: itemId },
        include: { product: true },
      });

      if (!cartItem) {
        throw new NotFoundException(`Cart item with ID ${itemId} not found`);
      }

      // Validate stock within transaction
      if (quantity > cartItem.product.stock) {
        throw new BadRequestException(
          `Not enough stock. Available: ${cartItem.product.stock}`,
        );
      }

      const updatedItem = await tx.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });

      return {
        id: updatedItem.id,
        productId: updatedItem.productId,
        quantity: updatedItem.quantity,
        product: {
          ...updatedItem.product,
          price: Number(updatedItem.product.price),
        },
      };
    });
  }

  async removeItem(itemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from cart' };
  }

  async clearCart(sessionId: string, userId?: string) {
    // Prefer userId if authenticated
    const whereClause = userId ? { userId } : { sessionId };

    const cart = await this.prisma.cart.findFirst({
      where: whereClause,
    });

    if (!cart) {
      return { message: 'Cart is already empty' };
    }

    await this.prisma.cart.delete({
      where: { id: cart.id },
    });

    return { message: 'Cart cleared' };
  }
}
