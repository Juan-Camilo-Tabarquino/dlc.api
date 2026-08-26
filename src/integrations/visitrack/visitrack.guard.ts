import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';

@Injectable()
export class VisitrackGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id?: number }; visitrackUser?: User }>();
    const user = await this.users.findOne({
      where: { id: request.user?.id },
      relations: { company: true },
    });
    // Existing role ids: 1=superadministrator, 2=administrator.
    if (!user || ![1, 2].includes(user.role))
      throw new ForbiddenException('Visitrack requires administrator access');
    request.visitrackUser = user;
    return true;
  }
}
