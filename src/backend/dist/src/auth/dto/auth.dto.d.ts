export declare class RegisterUserAuthDto {
    id: string;
    name: string;
    last_name: string;
    password: string;
    photo?: string;
    email: string;
    cpf: string;
    role: string;
    region: string;
    status: boolean;
    companyId?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
