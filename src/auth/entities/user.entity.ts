import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema() // Este decorador indica que la clase es un esquema de Mongoose
export class User {
  _id?: string;

  @Prop({ required: true, unique: true }) // Este decorador indica que el campo es requerido y único
  email: string;
  @Prop({ required: true, minlength: 6 }) // Este decorador indica que el campo es requerido y único
  password?: string;
  @Prop({ required: true }) // Este decorador indica que el campo es requerido y único
  name: string;
  @Prop({ default: true }) // Este decorador indica que el campo es requerido y único
  isActive: boolean;
  @Prop({ type: [String], default: ['user'] }) // Este decorador indica que el campo es requerido y único
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User); // Este método crea un esquema de Mongoose a partir de la clase User
