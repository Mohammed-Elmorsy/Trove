import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const adminSecret = request.headers['x-admin-secret'] as string;

    const validSecret = this.configService.get<string>('app.adminSecret');

    if (!adminSecret || adminSecret !== validSecret) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    return true;
  }
}
