import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthServices as JwtAuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtAuthService: JwtAuthService
  ) {}

  async signup(email: string, password: string) {
    try {
      const existingUser = await this.usersService.findByEmail(email).catch(() => null);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.createUserRecord(email, hashedPassword);
      const token = this.jwtAuthService.generateToken(user);

      return {
        message: 'User created successfully',
        user,
        token
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async signin(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const token = this.jwtAuthService.generateToken(user);
      const { password: _, ...userWithoutPassword } = user;

      console.log('User signed in successfully:', userWithoutPassword, token); 

      return {
        message: 'Login successful',
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }
}
