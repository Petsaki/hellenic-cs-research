import db from "../db/connection";
import { DataTypes } from "sequelize";

// MARIOS: Maybe i dont need this table
const Notingsdep = db.define('notingsdep', {
    name: {
        field: 'name',
        type: DataTypes.STRING,
        primaryKey:true
    },
    position: {
        field: 'position',
        type: DataTypes.STRING,
    },
    inst: {
        field: 'inst',
        type: DataTypes.STRING,
    }
});

export default Notingsdep;