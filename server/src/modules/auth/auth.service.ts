import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(userId: string) {
    const user = await this.userService.findOne(userId);
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const token = await this.tokenService.createAuthTokens(user.id);
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user && bcrypt.compare(password, user.password)) {
      const token = await this.tokenService.createAuthTokens(user.id);
      return { user, token };
    }
    return null;
  }
}
