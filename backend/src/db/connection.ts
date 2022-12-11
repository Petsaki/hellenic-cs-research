import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || '',
    port: (process.env.DB_PORT || 3306) as number,
    dialect: 'mariadb',
    define: {
        // Stop the auto-pluralization performed by Sequelize. This way will infer the table name to be equal to the model name
        freezeTableName: true,
        // Does not let Sequelize to add automatically the fields createdAt and updatedAt
        timestamps: false
    }
});

export default sequelize;