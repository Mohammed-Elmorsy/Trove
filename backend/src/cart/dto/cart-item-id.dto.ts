import { IsUUID } from 'class-validator';

export class CartItemIdDto {
  @IsUUID()
  itemId: string;
}
