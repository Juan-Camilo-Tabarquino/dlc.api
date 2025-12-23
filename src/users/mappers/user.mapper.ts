import { User } from '../user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, tokenfirebase, serverDate, createDate, ...rest } = user;
    return rest;
  }

  static toResponseList(users: User[]): UserResponseDto[] {
    return users.map(this.toResponse);
  }
}
