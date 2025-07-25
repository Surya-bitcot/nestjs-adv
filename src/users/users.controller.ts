import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { AuthServices } from 'src/auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/signin-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Serialize } from '../interceptors/serialize.interceptor';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly authServices: AuthServices
  ) {}


  // Step 1: Redirect user to Google for authentication
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req) {
    // The guard will redirect to Google login page.
  }

  // Step 2: Handle callback after Google authentication
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleLoginRedirect(@Req() req) {
    console.log('Google Auth User:', req.user);
    // At this point, the user is authenticated and `req.user` will contain the user data.
    return { message: 'User authenticated successfully', user: req.user };
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const result = await this.authService.signup(body.email, body.password);
    console.log('User created successfully:', result.user);
    return result.user;
  }

  @Post('/signin')
  async signinUser(@Body() body: SigninUserDto) {
    const result = await this.authService.signin(body.email, body.password);
    console.log('User signed in successfully:', result.user);
    return result.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return await this.usersService.find();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return await this.usersService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }
}

