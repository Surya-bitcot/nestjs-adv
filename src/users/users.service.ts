import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private readonly repo: Repository<User>,
//   ) {}


//   async findByEmail(email: string): Promise<User> {
//     const user = await this.repo.findOne({ where: { email } });
//     if (!user) {
//       throw new NotFoundException(`User with email ${email} not found`);
//     }
//     return user;
//   }


//   async create(email: string, password: string): Promise<{ message: string; user?: User }> {
//     try {
//       const existingUser = await this.repo.findOne({ where: { email } });
//       if (existingUser) {
//         throw new ConflictException('User with this email already exists');
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const user = this.repo.create({ email, password: hashedPassword });
//       const savedUser = await this.repo.save(user);

//       return {
//         message: 'User created successfully',
//         user: savedUser,
//       };
//     } catch (error) {
//       if (error instanceof ConflictException) {
//         throw error;
//       }
//       throw new InternalServerErrorException('Failed to create user');
//     }
//   }


//   async signin(email: string, password: string): Promise<{ message: string; user?: Partial<User> }> {
//     try {
//       const user = await this.findByEmail(email);
//       const isPasswordValid = await bcrypt.compare(password, user.password);

//       if (!isPasswordValid) {
//         throw new UnauthorizedException('Invalid password');
//       }

//       const {password:_, ...safeUser } = user

//       return {
//         message: 'Login successful',
//         user: safeUser,
//       };
//     } catch (error) {
//       if (
//         error instanceof NotFoundException ||
//         error instanceof UnauthorizedException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException('Login failed');
//     }
//   }


//   async findOne(id: number): Promise<User> {
//     const user = await this.repo.findOne({ where: { id } });
//     if (!user) {
//       throw new NotFoundException(`User with ID ${id} not found`);
//     }
//     return user;
//   }


//   async find(): Promise<User[]> {
//     return await this.repo.find();
//   }


//   async update(id: number, attrs: Partial<User>): Promise<User> {
//   const user = await this.findOne(id);
//   if (!user) {
//     throw new NotFoundException(`User with ID ${id} not found`);
//   }

//   if (attrs.email) {
//     const existingUser = await this.repo.findOne({ where: { email: attrs.email } });

//     if (existingUser) {
//       throw new BadRequestException(`Email ${attrs.email} is already in use`);
//     }
//   }

//   Object.assign(user, attrs);
//   return await this.repo.save(user);
// }



//   async remove(id: number): Promise<{ message: string }> {
//     const user = await this.findOne(id);
//     if (!user) {
//       throw new NotFoundException(`User with ID ${id} not found`);
//     }
//     await this.repo.remove(user);
//     return { message: `User with ID ${id} has been deleted` };
//   }
// }



@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // Called by AuthService
  async createUserRecord(email: string, hashedPassword: string): Promise<User> {
    const user = this.repo.create({ email, password: hashedPassword });
    return await this.repo.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async find(): Promise<User[]> {
    return await this.repo.find();
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (attrs.email) {
      const existingUser = await this.repo.findOne({ where: { email: attrs.email } });
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException(`Email ${attrs.email} is already in use`);
      }
    }

    Object.assign(user, attrs);
    return await this.repo.save(user);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.repo.remove(user);
    return { message: `User with ID ${id} has been deleted` };
  }


 // Find a user by their OAuth ID
  async findByOAuthId(oauthId: string): Promise<User> {
    return this.repo.findOne({ where: { oauthId } });
  }

  // Create a new user using OAuth data
  async createOAuthUser(oauthId: string, email: string, name: string, provider: string): Promise<User> {
    const user = this.repo.create({
      email,
      name,
      oauthId,
      provider,
      // Optionally, store profile picture or other data from OAuth provider
    });

    return await this.repo.save(user);
  }
}




