import db from "../db/connection";
import { DataTypes } from "sequelize";

const Publications = db.define('publications', {
    id: {
        field: 'gsid',
        type: DataTypes.STRING,
        primaryKey:true
    },
    year: {
        field: 'cyear',
        type: DataTypes.INTEGER,
    },
    counter: {
        field: 'counter',
        type: DataTypes.INTEGER,
    }
});

export default Publications;