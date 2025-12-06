import { IsUUID } from 'class-validator';

export class CartSessionDto {
  @IsUUID()
  sessionId: string;
}
