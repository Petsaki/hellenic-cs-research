import { Query, Send } from 'express-serve-static-core';
import { InferAttributes, InferCreationAttributes, Model, ModelDefined, Optional } from "sequelize";

// Response Data interface
export interface ResponseData<T> {
    code: number;
    data?: T;
    description: string;
    success: boolean;
}

export interface ErrorData {
    code: number;
    description: string;
}

export enum cacheKeysEnum {
    Position = 'position',
    YearsRange = 'yearsRange',
    DepartmentsID = 'departmentsID'
}

export interface cacheData {
    position: IDep[],
    yearsRange: {year: number}[],
    departmentsID: IDepartments[]
}

/* This code is declaring a global namespace for the Express library in TypeScript. It is adding a new
property called `cache` to the `Request` interface of the Express library. This allows developers to
attach a `cache` object to the `Request` object in their code, which can be used to store and
retrieve cached data for the request. */
declare global {
    namespace Express {
      interface Request {
        cache: cacheData;
      }
    }
}

// Request Typed interface with body and query
export interface omeaCitationsReq<T extends Query, U> extends Express.Request {
    body: U,
    query: T
}

// Request Typed interface with params and query
// params is from the url dynamic variables
export interface omeaCitationsReqQuery<Params,T extends Query> extends Express.Request {
    params: Params,
    query: T
}

// Request Typed interface with body only
export interface omeaCitationsReqBody<T> extends Express.Request {
    body: T
}

// Response Typed interface
export interface omeaCitationsRes<D> extends Express.Response {
    json: Send<ResponseData<D>, this>;
 }

// All table's interfaces

// All citation models
export interface citationBaseModel {
    id: string;
    year: number;
    counter: number;
}

export interface ICitation extends citationBaseModel, Model<InferAttributes<ICitation>, InferCreationAttributes<ICitation>> {}


// All dep models
export interface depBaseModel {
    id: string;
    name: string;
    position: string;
    inst: string;
    hindex: number;
    publications: number;
    citations: number;
    hindex5: number;
    citations5: number;
    publications5: number;
}

export interface depModel extends Model<depBaseModel,depBaseModel> {}


export interface IDep extends depBaseModel, Model<InferAttributes<IDep>, InferCreationAttributes<IDep>> {}

// All department models
export interface departmentsBaseModel {
    id: string;
    deptname: string;
    university: string;
    urldep: string;
    urledip: string;
    url: string;
}

export interface IDepartments extends departmentsBaseModel, Model<InferAttributes<IDepartments>, InferCreationAttributes<IDepartments>> {}


// I can create optional field for deparments, like for the filter i want only the id and the name of deparment
// export type departmentsCreationAttributes = Optional<departmentsBaseModel, 'id'>;
export type departmentsCreationAttributes = {};

// departmentsModelDefined not using somewhere but i keeping it for the future
export interface departmentsModelDefined extends ModelDefined<departmentsBaseModel,departmentsCreationAttributes> {}
export interface departmentsModel extends Model<departmentsBaseModel,departmentsBaseModel> {}


// All notings models
export interface notingsdepBaseModel {
    name: string;
    position: string;
    inst: string;
}

export interface INotingsdep extends notingsdepBaseModel, Model<InferAttributes<INotingsdep>, InferCreationAttributes<INotingsdep>> {}


// All publications models
export interface publicationsBaseModel {
    id: string;
    year: number;
    counter: number;
}

export interface publicationsModel extends Model<publicationsBaseModel,publicationsBaseModel> {}

export interface IPublications extends publicationsBaseModel, Model<InferAttributes<IPublications>, InferCreationAttributes<IPublications>> {}
