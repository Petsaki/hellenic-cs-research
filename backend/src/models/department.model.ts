import db from "../db/connection";
import { DataTypes } from "sequelize";

const Departments = db.define('departments', {
    id: {
        field: 'id',
        type: DataTypes.STRING,
        primaryKey:true
    },
    deptname: {
        field: 'deptname',
        type: DataTypes.STRING,
    },
    university: {
        field: 'University',
        type: DataTypes.STRING,
    },
    urldep: {
        field: 'urldep',
        type: DataTypes.STRING,
    },
    urledip: {
        field: 'urledip',
        type: DataTypes.STRING,
    },
    url: {
        field: 'url',
        type: DataTypes.STRING,
    }
});

export default Departments;