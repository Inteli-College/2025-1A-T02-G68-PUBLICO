import { JwtService } from '@nestjs/jwt';
export declare class LoggerService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    logRequest(authHeader: string | undefined, ip: string, method: string, url: string): Promise<void>;
}
