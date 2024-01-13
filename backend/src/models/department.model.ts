import db from "../db/connection";
import { DataTypes } from "sequelize";
import { IDepartments } from "../types";

// I can put type on define but i am not using it on department controller
// const Departments: departmentsModelDefined = db.define('departments', {
const Departments = db.define<IDepartments>('departments', {
    id: {
        field: 'id',
        type: DataTypes.STRING(30),
        allowNull: false,
        primaryKey: true,
    },
    deptname: {
        field: 'deptname',
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    university: {
        field: 'University',
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    urldep: {
        field: 'urldep',
        type: DataTypes.STRING(512),
        allowNull: true,
    },
    urledip: {
        field: 'urledip',
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    url: {
        field: 'url',
        type: DataTypes.STRING(45),
        allowNull: true,
    }
});

export default Departments;