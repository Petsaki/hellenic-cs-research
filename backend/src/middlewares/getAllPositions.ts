import { Request, Response, NextFunction } from 'express';
import { getAllPositions } from '../controllers/academic-staff.controller';
import cache from 'memory-cache';
import { IDep, cacheData, cacheKeysEnum, omeaCitationsReqBody, omeaCitationsRes } from '../types';
import { tryCatch } from '../utils/tryCatch';
import Dep from '../models/dep.model';
import { sendResponse } from '../api/common';
import { Op, Sequelize } from 'sequelize';
import errorHandler from './errorHandler';
import { cacheTime, reqCache } from '../server';


/* Handles caching of academic staff positions.
It uses the `tryCatch` utility function to handle any errors that may
occur during execution. */
export const getCacheAllPositions = tryCatch(async (req: omeaCitationsReqBody<unknown>, res: omeaCitationsRes<IDep[]>, next: NextFunction) => {
    const cachedData: IDep[] = cache.get(cacheKeysEnum.Position);
    if (!cachedData) {
        const result = await getAllPositions();
        cache.put(cacheKeysEnum.Position, result, cacheTime);
        reqCache.position = result;
    }
    req.cache = reqCache;
    next();
}, true);