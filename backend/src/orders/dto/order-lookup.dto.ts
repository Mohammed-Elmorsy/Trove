import { IsEmail, IsOptional, IsUUID } from 'class-validator';

export class OrderLookupDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsUUID()
  @IsOptional()
  sessionId?: string;
}

export class OrderIdDto {
  @IsUUID()
  id: string;
}
