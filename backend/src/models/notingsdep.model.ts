import db from "../db/connection";
import { DataTypes } from "sequelize";
import Departments from "./department.model";
import { INotingsdep } from "../types";

// MARIOS: Maybe i dont need this table
const Notingsdep = db.define<INotingsdep>('notingsdep', {
    name: {
        field: 'name',
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey:true
    },
    position: {
        field: 'position',
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey:true
    },
    inst: {
        field: 'inst',
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: Departments,
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
});

export default Notingsdep;