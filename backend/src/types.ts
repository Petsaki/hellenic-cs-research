import { Query, Send, Params } from 'express-serve-static-core';
import { Model, ModelDefined, Optional } from "sequelize";

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

// Δεν θυμάμαι τι ήθελα να κάνω με αυτά(τα είχα κάνει στην δουλειά)
// interface test extends Query {
//     test: string
//     test2: string
// }

// interface myParams {
//     id: string
// }

// // A request that gets an id for params and test,test2 for query!
// // Query can be many things and doing extends to Query adds many types that can that be
// export interface omeaCitationsReqQueryFilter extends omeaCitationsReqQuery<myParams,test> {}


// Request Typed interface with body and query
export interface omeaCitationsReq<T extends Query, U> extends Express.Request {
    body: U,
    query: T
}


export interface omeaCitationsReqQuery<Params,T extends Query> extends Express.Request {
    params: Params
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
export interface citationModel {
    id: string;
    year: number;
    counter: number;
}

export interface depModel {
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

export interface departmentsBaseModel {
    id: string;
    deptname: string;
    university: string;
    urldep: string;
    urledip: string;
    url: string;
}

// I can create optional field for deparments, like for the filter i want only the id and the name of deparment
// export type departmentsCreationAttributes = Optional<departmentsBaseModel, 'id'>;
export type departmentsCreationAttributes = {};

// departmentsModelDefined not using somewhere but i keeping it for the future
export interface departmentsModelDefined extends ModelDefined<departmentsBaseModel,departmentsCreationAttributes> {}
export interface departmentsModel extends Model<departmentsBaseModel,departmentsBaseModel> {}

export interface publicationsModel extends Model<publicationsBaseModel,publicationsBaseModel> {}

export interface notingsdepModel {
    name: string;
    position: string;
    inst: string;
}

export interface publicationsBaseModel {
    id: string;
    year: number;
    counter: number;
}