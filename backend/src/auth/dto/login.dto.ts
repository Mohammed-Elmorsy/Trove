import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  sessionId?: string; // For cart merge on login
}
