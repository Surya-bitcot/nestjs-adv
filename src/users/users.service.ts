import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

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

  async findByEmailOptional(email: string): Promise<User | null> {
    return await this.repo.findOne({ where: { email } });
  }

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
    return await this.repo.find({
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

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

  async findByOAuthId(oauthId: string): Promise<User | null> {
    return this.repo.findOne({ where: { oauthId } });
  }

  async createOAuthUser(oauthId: string, email: string, name: string, provider: string): Promise<User> {
    const user = this.repo.create({
      email,
      name,
      oauthId,
      provider,
    });

    return await this.repo.save(user);
  }
}




