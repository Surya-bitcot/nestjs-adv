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


   // This method validates if the user exists or needs to be created
  async validateOAuthLogin(oauthId: string, email: string, name: string) {
    // First, check if the user exists by their OAuth ID
    let user = await this.usersService.findByOAuthId(oauthId);

    if (!user) {
      // If the user doesn't exist, create a new user
      user = await this.usersService.createOAuthUser(oauthId, email, name, 'google');
    }

    const token = await this.generateToken(user)

    console.log("userrrrr",user)
    console.log("tokennnnn", token)

    // Return the user object (or you can generate a JWT token here if needed)
    return {user, token};
  }
}
