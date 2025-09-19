import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { type Dialect } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

let options: SequelizeOptions

if (process.env.NODE_ENV === 'test') {
    options = {
        database: ':memory:',
        dialect: 'sqlite',
        storage: ':memory:',
        models: [path.resolve(__dirname, '../Data/Tables')],
        logging: false
    }
} else {
    options = {
        database: process.env.SCHEMA_RELATIONAL_DB,
        dialect: process.env.DATABASE_DIALECT as Dialect,
        username: process.env.USER_RELATIONAL_DB,
        password: process.env.PASSWORD_RELATIONAL_DB,
        models: [path.resolve(__dirname, '../Data/Tables')],
        logging: false
    }
}

export const sequelize = new Sequelize(options);
