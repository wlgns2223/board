import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DBService {
  private pool: mysql.Pool;
  private logger = new Logger(DBService.name);

  constructor(configService: ConfigService) {
    this.pool = mysql.createPool({
      host: configService.get<string>('DB_HOST'),
      user: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  async query(sql: string, values?: any): Promise<any> {
    const conn = await this.pool.getConnection();
    try {
      const [rows, fields] = await conn.query(sql, values);
      return rows;
    } catch (error) {
      this.logger.error('CONNECTING TO DB FAILED');
      this.logger.error(error);
    } finally {
      conn.release();
    }
  }
}
