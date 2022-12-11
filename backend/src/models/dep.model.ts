import db from "../db/connection";
import { DataTypes } from "sequelize";

const Dep = db.define('dep', {
    id: {
        field: 'gsid',
        type: DataTypes.STRING,
        primaryKey:true
    },
    name: {
        field: 'name',
        type: DataTypes.STRING,
    },
    position: {
        field: 'position',
        type: DataTypes.STRING,
    },
    inst: {
        field: 'inst',
        type: DataTypes.STRING,
    },
    hindex: {
        field: 'hindex',
        type: DataTypes.INTEGER,
    },
    publications: {
        field: 'publications',
        type: DataTypes.INTEGER,
    },
    citations: {
        field: 'citations',
        type: DataTypes.INTEGER,
    },
    hindex5: {
        field: 'hindex5',
        type: DataTypes.INTEGER,
    },
    citations5: {
        field: 'citations5',
        type: DataTypes.INTEGER,
    },
    publications5: {
        field: 'publications5',
        type: DataTypes.INTEGER,
    },
});

export default Dep;