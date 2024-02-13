import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import { QueryHelper } from '../common/utils/queryHelper';

@Injectable()
export class DBService {
  private pool: mysql.Pool;
  private logger = new Logger(DBService.name);
  private queryHelper: QueryHelper = new QueryHelper();

  private toColumns() {
    return this.queryHelper.toColumns();
  }

  private toValues() {
    return this.queryHelper.toValues();
  }

  private toPlaceholders() {
    return this.queryHelper.toPlaceholders();
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

  helpUpdate(obj: any) {
    const snakeCaseObj = this.toSnakeCase(obj);
    this.queryHelper.setObj(snakeCaseObj);
    return this.queryHelper.toUpdate();
  }

  helpInsert<T = any>(obj: T) {
    const snakeCaseObj = this.toSnakeCase(obj);
    this.queryHelper.setObj(snakeCaseObj);

    const columns = this.toColumns();
    const values = this.toValues();
    const placesholders = this.toPlaceholders();

    return {
      columns,
      values,
      placesholders,
    };
  }

  /**
   * 학습 및 실험적 코딩
   */
  private toSnakeCase(param: any): any;
  private toSnakeCase(param: any[]): any {
    if (typeof param === 'object') {
      const snakeCaseObj = {};
      for (const key in param) {
        const snakeCaseKey = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`,
        );
        snakeCaseObj[snakeCaseKey] = param[key];
      }
      return snakeCaseObj;
    }

    if (typeof param === 'string') {
      return (param as string).replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
    }
  }

  /**
   *  Row가 배열임
   */

  async getLastInsertedRow(sql: string) {
    const result = await this.query(sql);

    return result[0];
  }

  async query(sql: string, values?: any): Promise<any> {
    const conn = await this.pool.getConnection();

    try {
      const [rows, fields] = await conn.query(sql, values);

      return rows;
    } catch (error) {
      this.logger.error('Query: ' + sql);
      this.logger.error('Values: ' + values);
      this.logger.error(error);
      throw new Error(error);
    } finally {
      conn.release();
    }
  }
}
