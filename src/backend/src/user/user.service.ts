import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validates if a user exists by email
   */
  async validateUserByEmail(email: string) {
    const user = await this.prisma.tb_user.findUnique({
      where: { email },
      include: { auth: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user ? true : false;
  }

  /**
   * Validates if a user exists by email
   */
  async findOne(id: string) {
    const user = await this.prisma.tb_user.findUnique({
      where: { id },
      include: { auth: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity();
  }

  /**
   * Validates if a user exists by CPF
   */
  async validateUserByCPF(cpf: string) {
    const user = await this.prisma.tb_user.findUnique({
      where: { cpf },
      include: { auth: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user ? true : false;
  }

  async remove(id: string) {
    const user = await this.prisma.tb_user.findUnique({
      where: { id },
      include: { auth: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.tb_user.delete({
      where: {
        id,
      },
    });

    return new UserEntity();
    // return {
    //   message: 'User deleted with success!',
    //   new UserEntity
    // };
  }
}
