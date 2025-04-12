import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserAuthDto, LoginDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly userService;
    private tokenBlacklist;
    constructor(prisma: PrismaService, jwtService: JwtService, userService: UserService);
    register(dto: RegisterUserAuthDto): Promise<RegisterUserAuthDto>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    logout(token: string): {
        message: string;
    };
    isTokenRevoked(token: string): boolean;
}
