import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user) {
      const correctPassword = await bcrypt.compare(password, user.password);
      if (user && correctPassword) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = omit(user, ['password']);
        return result;
      }
    }
    throw new UnauthorizedException(
      'La contrasena o el usuario son incorrectos',
    );
  }

  async login(user: Omit<User, 'password'>) {
    const payload = {
      username: user.username,
      sub: user.id,
      fullname: user.name,
    };
    return {
      id: user.id,
      fullName: user.name,
      username: user.username,
      roles: [],
      token: this.jwtService.sign(payload),
      user,
    };
  }
}
