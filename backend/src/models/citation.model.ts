import db from "../db/connection";
import { DataTypes } from "sequelize";
import Dep from "./dep.model";
import { ICitation } from "../types";

export const Citations = db.define<ICitation>('citations', {
    id: {
        // Ean den douleuei kati me to id auto tote ftaiei pou tou exw dwsei allo onoma
        // kai den to briskei kapoio allo table pou to grafw me gsid
        field: 'gsid',
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: Dep,
            key: 'gsid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
    },
    year: {
        field: 'cyear',
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    counter: {
        field: 'counter',
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});


export default Citations;