import { IsUUID, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingAddressDto } from './shipping-address.dto';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  sessionId: string;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  @IsNotEmpty()
  shippingAddress: ShippingAddressDto;
}
