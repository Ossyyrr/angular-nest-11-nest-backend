import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createAuthDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createAuthDto);

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      createdUser.password = await bcrypt.hashSync(createdUser.password, salt);

      await createdUser.save();

      const newCreatedUser = {
        ...createdUser.toJSON(),
        password: '******',
      };
      return newCreatedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createAuthDto.email} already exists`);
      }
      throw new InternalServerErrorException('Error');
    }
  }

  async login(loginDto: LoginDto) {
    console.log(loginDto);

    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Quito el password de la respuesta
    const { password: _, ...rest } = user.toJSON();

    // Generar token de acceso
    return {
      ...rest,
      token: 'token',
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
