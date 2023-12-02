import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DBService {
  private pool: mysql.Pool;
  private logger = new Logger(DBService.name);

  private toColumns(obj: any) {
    return `( ${Object.keys(obj).join(',')} )`;
  }

  private toValues(obj: any) {
    return `( ${Object.values(obj)
      .map((value) => `"${value}"`)
      .join(',')} )`;
  }

  private toPlaceholders(obj: any) {
    return `( ${Object.values(obj)
      .map((value) => '?')
      .join(',')} )`;
  }

  helpUpdate(obj: any) {
    return Object.keys(obj)
      .map((key) => `${key} = "${obj[key]}"`)
      .join(',');
  }

  helpInsert(obj: any) {
    const columns = this.toColumns(obj);
    const values = this.toValues(obj);
    const placesholders = this.toPlaceholders(obj);

    return {
      columns,
      values,
      placesholders,
    };
  }

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

  /**
   *  Row가 배열임
   */
  async query(sql: string, values?: any): Promise<any> {
    const conn = await this.pool.getConnection();

    try {
      const [rows, fields] = await conn.query(sql, values);

      return rows;
    } catch (error) {
      this.logger.error('Query: ' + sql);
      this.logger.error(error);
      throw new Error(error);
    } finally {
      conn.release();
    }
  }
}
