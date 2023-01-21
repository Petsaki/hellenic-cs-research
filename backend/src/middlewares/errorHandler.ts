import { NextFunction, Request } from "express";
import { AccessDeniedError, BaseError, ConnectionError, ConnectionRefusedError } from "sequelize";
import { sendResponse } from "../api/common";
import { omeaCitationsRes } from "../types";
import sequelizeErrorHandle from "../utils/sequelizeErrorHandle";

const errorHandler = (error: Error | BaseError, req: Request, res: omeaCitationsRes<never>, next: NextFunction) => {
    // console.log(error instanceof Error);
    // console.log(error instanceof BaseError);
    // console.log(error instanceof ConnectionError);
    // console.log(error instanceof ConnectionRefusedError);
    // console.log(error instanceof AccessDeniedError);

    // The base error for all sequelize errors
    if (error instanceof BaseError) {
        const resData = sequelizeErrorHandle(error);
        return res.json(sendResponse(resData.code, resData.description))
    } else {
        // Default error code 400 for user bad request
        return res.json(sendResponse(400, error.message));
    }
}

export default errorHandler;