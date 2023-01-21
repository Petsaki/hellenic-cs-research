import { NextFunction } from "express";
import { omeaCitationsReqQuery, omeaCitationsRes } from "../types";

// TODO: Find better approach for req, res types or add all possible types that they can take
export const tryCatch = (controller: Function) => async (req: omeaCitationsReqQuery<never,never>, res: omeaCitationsRes<never>, next: NextFunction) => {
    try {
        await controller(req, res);
    } catch (error) {
        return next(error);
    }
}   