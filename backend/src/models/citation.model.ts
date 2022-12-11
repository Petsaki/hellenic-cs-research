import db from "../db/connection";
import { DataTypes } from "sequelize";

export const Citations = db.define('citations', {
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

export default Citations;