import { NextFunction, Request } from "express";
import { BaseError } from "sequelize";
import { ZodError } from "zod";
import { sendResponse } from "../api/common";
import { ErrorData, omeaCitationsRes } from "../types";
import sequelizeErrorHandle from "../utils/sequelizeErrorHandle";
import zodErrorHandle from "../utils/zodErrorHandle";

const errorHandler = (error: Error | BaseError, req: Request, res: omeaCitationsRes<unknown>, next: NextFunction) => {
    
    let resData: ErrorData = {code: NaN, description: ''};

    // The base error for all sequelize errors
    if (error instanceof BaseError) {
        resData = sequelizeErrorHandle(error);
    // The base error for all zod errors
    } else if (error instanceof ZodError) {
        resData = zodErrorHandle(error);
    }

    if (!!resData.code) {
        return res.json(sendResponse(resData.code, resData.description))
    } else {
        // Default error code 400 for user bad request
        return res.json(sendResponse(400, error.message));
    }
}

export default errorHandler;