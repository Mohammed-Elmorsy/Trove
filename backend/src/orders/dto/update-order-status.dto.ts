import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(ORDER_STATUSES, {
    message: `Status must be one of: ${ORDER_STATUSES.join(', ')}`,
  })
  status: OrderStatus;
}
