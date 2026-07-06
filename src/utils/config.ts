import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    DATABASE_URL: string | undefined,
    SECRET: string
}
const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    SECRET: 'SECRET'
};

export default config;