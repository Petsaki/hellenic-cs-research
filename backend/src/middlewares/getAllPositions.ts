import { NextFunction } from 'express';
import { getAllPositions } from '../controllers/academic-staff.controller';
import cache from 'memory-cache';
import { IDep, cacheData, cacheKeysEnum, omeaCitationsReqBody, omeaCitationsRes } from '../types';
import { tryCatch } from '../utils/tryCatch';
import { cacheTime, reqCache } from '../server';


/* Handles caching of academic staff positions.
It uses the `tryCatch` utility function to handle any errors that may
occur during execution. */
export const getCacheAllPositions = tryCatch(async (req: omeaCitationsReqBody<unknown>, res: omeaCitationsRes<string[]>, next: NextFunction) => {
    const cachedData: string[] = cache.get(cacheKeysEnum.Position);
    if (!cachedData) {
        const result = await getAllPositions();
        cache.put(cacheKeysEnum.Position, result, cacheTime);
        reqCache.position = result;
    }
    req.cache = reqCache;
    next();
}, true);