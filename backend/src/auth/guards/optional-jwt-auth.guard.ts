import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: TUser | false,

    _info: any,

    _context: ExecutionContext,
  ): TUser | null {
    // Don't throw an error if authentication fails
    // Just return null instead
    if (err || !user) {
      return null as TUser;
    }
    return user;
  }
}
