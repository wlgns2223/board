import { User } from './user.model';

export type UserWithoutPassword = Omit<User, 'password'>;
