/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserAuthDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  private tokenBlacklist: Set<string> = new Set();
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(dto: RegisterUserAuthDto): Promise<RegisterUserAuthDto> {
    const user =
      (await this.userService.validateUserByEmail(dto.email)) ||
      (await this.userService.validateUserByCPF(dto.cpf));

    if (user) throw Error('User already exists. Email/CPF already registered!');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const new_user = await this.prisma.tb_user.create({
      data: {
        name: dto.name,
        last_name: dto.last_name,
        photo: dto.photo || '',
        email: dto.email,
        cpf: dto.cpf,
        role: dto.role as Role,
        region: dto.region,
        status: dto.status,
        companyId: dto.companyId,
        auth: {
          create: {
            password: hashedPassword,
            salt: salt,
          },
        },
      },
      include: {
        auth: true,
      },
    });

    return {
      id: new_user.id,
      name: new_user.name,
      last_name: new_user.last_name,
      photo: new_user.photo || '',
      email: new_user.email,
      cpf: new_user.cpf,
      role: new_user.role,
      region: new_user.region,
      status: new_user.status,
      companyId: new_user.companyId || '',
      password: new_user.auth?.password || '',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.tb_user.findUnique({
      where: { email: dto.email },
      include: { auth: true },
    });

    if (!user)
      throw new NotFoundException(`No user found for email: ${dto.email}`);

    if (
      !user ||
      !user.auth?.password ||
      !(await bcrypt.compare(dto.password, user.auth?.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  logout(token: string) {
    this.tokenBlacklist.add(token);
    return { message: 'Logout successful' };
  }

  isTokenRevoked(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}
