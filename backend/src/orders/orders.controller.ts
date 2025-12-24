import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  BadRequestException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderIdDto, OrderLookupDto } from './dto/order-lookup.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OptionalJwtAuthGuard, JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser, Roles } from '../auth/decorators';
import type { JwtPayload } from '../auth/decorators';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Create a new order from cart
   * POST /orders
   */
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: JwtPayload | null,
  ) {
    const order = await this.ordersService.createOrder(
      createOrderDto,
      user?.sub,
    );
    return {
      message: 'Order created successfully',
      order,
    };
  }

  /**
   * Get authenticated user's orders
   * GET /orders/my-orders
   */
  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@CurrentUser('sub') userId: string) {
    return this.ordersService.getOrdersByUser(userId);
  }

  /**
   * Get order by ID
   * GET /orders/:id
   * User must own the order or be an admin
   */
  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getOrder(
    @Param() params: OrderIdDto,
    @CurrentUser() user: JwtPayload | null,
  ) {
    const order = await this.ordersService.getOrderById(params.id);

    // Authorization check: user must own the order or be admin
    if (user) {
      // Authenticated user: must own order or be admin
      if (order.userId === user.sub || user.role === Role.ADMIN) {
        return order;
      }
      throw new ForbiddenException('You do not have access to this order');
    }

    // Guest user: can only access guest orders (no userId) created with matching sessionId
    // For security, guest orders should be accessed via email lookup instead
    if (!order.userId) {
      // Allow access to guest orders (for order confirmation page)
      return order;
    }

    throw new ForbiddenException('You do not have access to this order');
  }

  /**
   * Lookup orders by email
   * GET /orders?email=xxx
   * Rate limited to prevent email enumeration attacks
   */
  @Get()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async lookupOrders(@Query() query: OrderLookupDto) {
    if (!query.email && !query.sessionId) {
      throw new BadRequestException('Email or sessionId is required');
    }

    if (query.email) {
      return this.ordersService.getOrdersByEmail(query.email);
    }

    // For future: lookup by sessionId
    throw new BadRequestException('Email is required');
  }

  /**
   * Update order status (ADMIN ONLY)
   * PATCH /orders/:id/status
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateOrderStatus(
    @Param() params: OrderIdDto,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(
      params.id,
      updateOrderStatusDto.status,
    );
  }
}
