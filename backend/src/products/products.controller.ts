import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { ProductIdDto } from './dto/product-id.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get('categories')
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get(':id')
  findOne(@Param() params: ProductIdDto) {
    return this.productsService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: ProductIdDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(params.id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param() params: ProductIdDto) {
    return this.productsService.remove(params.id);
  }
}
