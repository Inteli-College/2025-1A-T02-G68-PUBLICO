import { ObjectId } from 'typeorm';
export declare class UserEntity {
    id: ObjectId;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
