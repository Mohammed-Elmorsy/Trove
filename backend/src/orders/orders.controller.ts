import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderIdDto, OrderLookupDto } from './dto/order-lookup.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OptionalJwtAuthGuard, JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
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
   */
  @Get(':id')
  async getOrder(@Param() params: OrderIdDto) {
    return this.ordersService.getOrderById(params.id);
  }

  /**
   * Lookup orders by email
   * GET /orders?email=xxx
   */
  @Get()
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
   * Update order status (for admin use)
   * PATCH /orders/:id/status
   */
  @Patch(':id/status')
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
