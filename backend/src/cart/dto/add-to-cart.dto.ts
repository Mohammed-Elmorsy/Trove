import { IsUUID, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  sessionId: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number;
}
