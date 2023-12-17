import * as mysql from 'mysql2/promise';
import { CreateUserDto } from './src/users/dto/create.dto';
import { faker } from '@faker-js/faker';
import { Post } from './src/posts/posts.model';
import * as dayjs from 'dayjs';

const host = process.env.DB_HOST;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const seedPost = async () => {
  const pool = mysql.createPool({
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
  });

  const conn = await pool.getConnection();
  const usersSql = 'SELECT id FROM users';
  const [row, _] = await conn.query(usersSql);
  const userIds = (row as { id: string }[]).map((i) => i.id);
  const sql =
    'INSERT INTO posts (author_id, content,title,createdAt) VALUES (? ,? ,?,?)';

  console.log('start...');
  const from = dayjs('2023-01-01').toDate();
  const to = dayjs('2023-12-31').toDate();
  Array.from({ length: 100 }).forEach(async () => {
    const idx = Math.floor(Math.random() * userIds.length);
    const dto: Partial<Post> = {
      authorId: userIds[idx],
      content: faker.lorem.paragraph({ min: 1, max: 2 }),
      title: faker.lorem.word({
        length: {
          min: 3,
          max: 40,
        },
      }),
      createdAt: faker.date.between({
        from,
        to,
      }),
    };

    await conn.query(sql, Object.values(dto));
  });
  console.log('end...');
};

const seedUsers = async () => {
  console.log('start...');
  const pool = mysql.createPool({
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
  });
  const conn = await pool.getConnection();
  const sql = 'INSERT INTO USERS (email, password, nickname) VALUES (?,?,?)';

  Array.from({ length: 10 }).forEach(async () => {
    const dto: CreateUserDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      nickname: faker.internet.userName(),
    };

    await conn.query(sql, Object.values(dto));
  });
  console.log('end...');
};

seedPost();
