import db from "../db/connection";
import { DataTypes } from "sequelize";
import Dep from "./dep.model";
import { ICitation } from "../types";

export const Citations = db.define<ICitation>('citations', {
    id: {
        // If something is not working with this ID, then it's likely that I have assigned a different name to it,
        // and it cannot find another table that I am referring to with the given identifier.
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