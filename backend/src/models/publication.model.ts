import db from "../db/connection";
import { DataTypes } from "sequelize";
import Dep from "./dep.model";
import { IPublications } from "../types";

const Publications = db.define<IPublications>('publications', {
    id: {
        field: 'gsid',
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
        references: {
            model: Dep,
            key: 'gsid'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    year: {
        field: 'cyear',
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    counter: {
        field: 'counter',
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default Publications;