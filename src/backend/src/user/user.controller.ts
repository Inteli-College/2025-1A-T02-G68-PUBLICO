import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Roles } from '../decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Verifica se um email já está cadastrado
   * Endpoint: GET /user/validate-email/:email
   */
  @Get('validate-email/:email')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async validateEmail(@Param('email') email: string) {
    return this.userService.validateUserByEmail(email);
  }

  /**
   * Verifica se um CPF já está cadastrado
   * Endpoint: GET /user/validate-cpf/:cpf
   */
  @Get('validate-cpf/:cpf')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async validateCPF(@Param('cpf') cpf: string) {
    return this.userService.validateUserByCPF(cpf);
  }

  // /**
  //  * Obtém o perfil do usuário autenticado
  //  * Endpoint: GET /user/auth/profile
  //  * Requer autenticação JWT
  //  */
  //
  // @Get('auth/profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return {
      message: 'User removed with success',
    };
  }

  @Get(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
}
