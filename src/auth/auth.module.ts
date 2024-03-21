import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { UserService } from './auth.service';
import { User, UserSchema } from './entities/user.entity';
@Module({
  controllers: [AuthController],
  providers: [UserService],
  imports: [
    ConfigModule.forRoot(), // sirve para leer las variables de entorno

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '6h' },
    }),
  ],
})
export class AuthModule {}
