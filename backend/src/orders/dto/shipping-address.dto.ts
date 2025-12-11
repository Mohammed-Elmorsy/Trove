import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\d\s\-+()]+$/, { message: 'Invalid phone number format' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  state: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'Invalid ZIP code format (e.g., 12345 or 12345-6789)',
  })
  zipCode: string;

  @IsString()
  @IsOptional()
  country?: string = 'USA';
}
