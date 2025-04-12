import { UserService } from '../user/user.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: {
        userId: string;
    }): Promise<import("../user/entities/user.entity").UserEntity>;
}
export {};
