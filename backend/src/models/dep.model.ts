import db from "../db/connection";
import { DataTypes } from "sequelize";
import Departments from "./department.model";
import { IDep } from "../types";

const Dep = db.define<IDep>('dep', {
    id: {
        field: 'gsid',
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
    },
    name: {
        field: 'name',
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    position: {
        field: 'position',
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: 'index_name',
    },
    inst: {
        field: 'inst',
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: Departments,
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    },
    hindex: {
        field: 'hindex',
        type: DataTypes.INTEGER,
    },
    publications: {
        field: 'publications',
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    citations: {
        field: 'citations',
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    hindex5: {
        field: 'hindex5',
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    citations5: {
        field: 'citations5',
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    publications5: {
        field: 'publications5',
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

export default Dep;