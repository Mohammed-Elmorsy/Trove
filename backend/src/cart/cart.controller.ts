import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartSessionDto } from './dto/cart-session.dto';
import { CartItemIdDto } from './dto/cart-item-id.dto';
import { OptionalJwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import type { JwtPayload } from '../auth/decorators';

@Controller('cart')
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':sessionId')
  getCart(
    @Param() params: CartSessionDto,
    @CurrentUser() user: JwtPayload | null,
  ) {
    return this.cartService.getCart(params.sessionId, user?.sub);
  }

  @Post('items')
  addItem(
    @Body() addToCartDto: AddToCartDto,
    @CurrentUser() user: JwtPayload | null,
  ) {
    return this.cartService.addItem(addToCartDto, user?.sub);
  }

  @Patch('items/:itemId')
  updateQuantity(
    @Param() params: CartItemIdDto,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateQuantity(params.itemId, updateCartItemDto);
  }

  @Delete('items/:itemId')
  removeItem(@Param() params: CartItemIdDto) {
    return this.cartService.removeItem(params.itemId);
  }

  @Delete(':sessionId')
  clearCart(
    @Param() params: CartSessionDto,
    @CurrentUser() user: JwtPayload | null,
  ) {
    return this.cartService.clearCart(params.sessionId, user?.sub);
  }
}
