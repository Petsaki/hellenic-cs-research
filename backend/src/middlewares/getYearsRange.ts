import { Request, Response, NextFunction } from 'express';
import cache from 'memory-cache';
import { IDep, IPublications, cacheData, cacheKeysEnum, omeaCitationsReqBody, omeaCitationsRes } from '../types';
import { tryCatch } from '../utils/tryCatch';
import Dep from '../models/dep.model';
import { sendResponse } from '../api/common';
import { Op, Sequelize } from 'sequelize';
import errorHandler from './errorHandler';
import { cacheTime, reqCache } from '../server';
import { getYearsRangeQuery } from '../controllers/years_range.controller';


/* If there is no cached data, it calls the `getYearsRange` function and caches the result.
The `tryCatch` function is used to handle any errors that may occur during the execution of this
middleware function. */
export const getCacheYearsRange = tryCatch(async (req: omeaCitationsReqBody<unknown>, res: omeaCitationsRes<{year: number}[]>, next: NextFunction) => {
    const cachedData: IPublications[] = cache.get(cacheKeysEnum.YearsRange);
    if (!cachedData) {
        const result = await getYearsRangeQuery();
        cache.put(cacheKeysEnum.YearsRange, result, cacheTime);
        reqCache.yearsRange = result;
    }
    req.cache = reqCache;
    next();
}, true);