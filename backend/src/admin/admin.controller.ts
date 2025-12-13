import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminGuard } from './guards/admin.guard';
import { AdminService } from './admin.service';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { QueryProductDto } from '../products/dto/query-product.dto';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly productsService: ProductsService,
  ) {}

  // ==================
  // Dashboard
  // ==================

  /**
   * GET /admin/dashboard/stats
   * Get dashboard statistics (total products, orders, revenue, etc.)
   */
  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ==================
  // Products
  // ==================

  /**
   * GET /admin/products
   * List all products with pagination and search
   */
  @Get('products')
  getProducts(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  /**
   * GET /admin/products/categories
   * Get all categories for product form dropdown
   */
  @Get('products/categories')
  getCategories() {
    return this.productsService.getCategories();
  }

  /**
   * GET /admin/products/:id
   * Get single product by ID
   */
  @Get('products/:id')
  getProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * POST /admin/products
   * Create a new product
   */
  @Post('products')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * PATCH /admin/products/:id
   * Update an existing product
   */
  @Patch('products/:id')
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * DELETE /admin/products/:id
   * Delete a product
   */
  @Delete('products/:id')
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  // ==================
  // Orders
  // ==================

  /**
   * GET /admin/orders
   * List all orders with pagination and optional status filter
   */
  @Get('orders')
  getOrders(@Query() query: QueryOrdersDto) {
    return this.adminService.getAllOrders(query);
  }

  /**
   * GET /admin/orders/:id
   * Get single order by ID
   */
  @Get('orders/:id')
  getOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getOrderById(id);
  }

  /**
   * PATCH /admin/orders/:id/status
   * Update order status
   */
  @Patch('orders/:id/status')
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.adminService.updateOrderStatus(id, updateOrderStatusDto.status);
  }
}
