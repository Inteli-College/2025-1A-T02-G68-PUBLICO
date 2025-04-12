import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validateUserByEmail(email: string): Promise<boolean>;
    findOne(id: string): Promise<UserEntity>;
    validateUserByCPF(cpf: string): Promise<boolean>;
    remove(id: string): Promise<UserEntity>;
}
