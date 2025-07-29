import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthServices {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  generateToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async validateOAuthLogin(oauthId: string, email: string, name: string) {
    let user = await this.usersService.findByOAuthId(oauthId);

    if (!user) {
      user = await this.usersService.createOAuthUser(oauthId, email, name, 'google');
    }

    const token = this.generateToken(user);

    return { user, token };
  }
}
