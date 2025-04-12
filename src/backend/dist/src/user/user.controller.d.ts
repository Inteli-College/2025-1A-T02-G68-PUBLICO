import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    validateEmail(email: string): Promise<boolean>;
    validateCPF(cpf: string): Promise<boolean>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<UserEntity>;
}
