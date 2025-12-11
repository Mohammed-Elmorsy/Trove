import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(sessionId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { sessionId },
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
        sessionId,
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

  async addItem(addToCartDto: AddToCartDto) {
    const { sessionId, productId, quantity } = addToCartDto;

    // Validate product exists and has sufficient stock
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Find or create cart
    let cart = await this.prisma.cart.findUnique({
      where: { sessionId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { sessionId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
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

    // Validate stock
    if (newQuantity > product.stock) {
      throw new BadRequestException(
        `Not enough stock. Available: ${product.stock}, Requested: ${newQuantity}`,
      );
    }

    // Upsert cart item
    const cartItem = await this.prisma.cartItem.upsert({
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
  }

  async updateQuantity(itemId: string, updateCartItemDto: UpdateCartItemDto) {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    // Validate stock
    if (quantity > cartItem.product.stock) {
      throw new BadRequestException(
        `Not enough stock. Available: ${cartItem.product.stock}`,
      );
    }

    const updatedItem = await this.prisma.cartItem.update({
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

  async clearCart(sessionId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { sessionId },
    });

    if (!cart) {
      return { message: 'Cart is already empty' };
    }

    await this.prisma.cart.delete({
      where: { sessionId },
    });

    return { message: 'Cart cleared' };
  }
}
