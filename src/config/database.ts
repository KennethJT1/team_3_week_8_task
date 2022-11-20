import { Sequelize } from 'sequelize';

export const db = new Sequelize('app', '', '', {
    storage: "./user.sqlite",
    dialect: "sqlite",
    logging: false
})
