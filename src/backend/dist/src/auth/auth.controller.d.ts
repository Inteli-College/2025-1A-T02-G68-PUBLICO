import { AuthService } from './auth.service';
import { RegisterUserAuthDto, LoginDto } from './dto/auth.dto';
import { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterUserAuthDto): Promise<RegisterUserAuthDto>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    logout(req: Request, res: Response): Response<any, Record<string, any>>;
}
