import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  last_name: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsEmail()
  email: string;

  @IsString()
  cpf: string;

  @IsString()
  role: string;

  @IsString()
  region: string;

  @IsBoolean()
  full_acess: boolean;

  @IsBoolean()
  status: boolean;

  @IsUUID()
  @IsOptional()
  companyId?: string;
}
