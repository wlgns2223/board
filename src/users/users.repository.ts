import { Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/db.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create.dto';
import { UserWithoutPassword } from './user.types';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersRepository {
  private logger = new Logger(UsersRepository.name);
  constructor(private conn: DBService) {}

  async findUserById(id: string) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const result = (await this.conn.query(sql, [id])) as User;
    return plainToInstance(User, result[0]);
  }

  async getUserByEmail(email: string): Promise<User> {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const result = await this.conn.query(sql, [email]);
    return plainToInstance(User, result[0]);
  }

  async createUser(userData: User) {
    let user: User | undefined = undefined;

    const columns = Object.keys(userData).join(',');
    const values = Object.values(userData)
      .map((value) => '?')
      .join(',');

    try {
      const sql = `INSERT INTO users (${columns}) VALUES (${values})`;
      await this.conn.query(sql, [...Object.values(userData)]);
      user = await this.getUserByEmail(userData.email);
    } catch (error) {
      this.logger.error(error);
    }

    return user;
  }

  async updateUser(email: string, attrs: Partial<UserWithoutPassword>) {
    let result: UserWithoutPassword | undefined = undefined;
    try {
      const update = this.conn.helpUpdate(attrs);
      const sql = `UPDATE users SET ${update} WHERE email = "${email}"`;

      await this.conn.query(sql, [email]);

      result = await this.getUserByEmail(email);
    } catch (error) {
      this.logger.error(error);
    } finally {
      return result;
    }
  }

  async deleteUserByEmail(email: string) {
    const sql = `DELETE FROM users WHERE email = ?`;
    try {
      await this.conn.query(sql, [email]);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new Error("Can't delete user");
    }
  }
}
