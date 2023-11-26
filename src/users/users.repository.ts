import { Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/db.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UsersRepository {
  private logger = new Logger(UsersRepository.name);
  constructor(private conn: DBService) {}

  async getUserByEmail(email: string) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const result = await this.conn.query(sql, [email]);
    return result[0];
  }

  async createUser(createDto: CreateUserDto) {
    let user: User | undefined = undefined;
    const values =
      '(' +
      Object.values(createDto)
        .map((value) => '?')
        .join(',') +
      ')';
    try {
      const sql = `INSERT INTO users VALUES ${values}`;
      await this.conn.query(sql, [...Object.values(createDto)]);
      user = await this.getUserByEmail(createDto.email);
    } catch (error) {
      this.logger.error(error);
    }

    return user;
  }

  async updateUser(email: string, attrs: Partial<User>) {
    let result: User | undefined = undefined;
    try {
      const update = Object.keys(attrs)
        .map((key) => `${key} = ?`)
        .join(', ');
      const values = Object.values(attrs);

      const sql = `UPDATE users SET ${update} WHERE email = ${email}`;
      await this.conn.query(sql, [...values, email]);

      result = await this.getUserByEmail(email);
    } catch (error) {
      this.logger.error(error);
    } finally {
      return result;
    }
  }
}
