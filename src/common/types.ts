export type EnvironmentConfig = {
  DB_HOST: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  TOKEN_SECRET: string;
  ACCESS_TOKEN_NAME: string;
  REFRESH_TOKEN_NAME: string;
};

export type t = 'ACCESS_TOKEN_NAME' | 'AAA';
