import { NextFunction, Request } from "express";
import { ErrorData, omeaCitationsRes } from "../types";
import errorHandler from "../middlewares/errorHandler";
import { BaseError } from "sequelize";

// TODO: Find better approach for req, res types or add all possible types that they can take

/**
 * This function wraps a controller function in a try-catch block to handle errors.
 * @returns The `next` function is being returned with the `error` parameter passed as an argument into the last middleware of the backend errorHandler.
 */
export const tryCatch = (controller: Function, cacheMiddleware = false) => async (req: Request, res: omeaCitationsRes<unknown>, next: NextFunction) => {
    try {
        cacheMiddleware ? await controller(req, res, next) : await controller(req, res);
    } catch (error) {
        return cacheMiddleware ? errorHandler(error as Error | BaseError, req, res, next) : next(error);
    }
}   