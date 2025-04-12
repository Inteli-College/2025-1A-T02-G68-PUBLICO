import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class RegisterUserAuthDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  last_name: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsEmail()
  email: string;

  @IsString()
  cpf: string;

  @IsEnum(Role)
  role: string;

  @IsString()
  region: string;

  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}

export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
