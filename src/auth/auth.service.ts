import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto, LoginDto, RegisterUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login.response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

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

  async register(registerUserDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerUserDto);
    console.log(user);
    return {
      user,
      token: this.getJwToken({ id: user._id }),
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
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
      user: rest,
      token: this.getJwToken({ id: user.id }),
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

  getJwToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
