import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsInt,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2048)
  imageUrl?: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsInt()
  @Min(0)
  stock: number;
}
