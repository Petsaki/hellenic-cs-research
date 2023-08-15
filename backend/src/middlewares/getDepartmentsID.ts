import { Request, Response, NextFunction } from 'express';
import cache from 'memory-cache';
import { IDep, IDepartments, IPublications, cacheData, cacheKeysEnum, omeaCitationsReqBody, omeaCitationsRes } from '../types';
import { tryCatch } from '../utils/tryCatch';
import Dep from '../models/dep.model';
import { sendResponse } from '../api/common';
import { Op, Sequelize } from 'sequelize';
import errorHandler from './errorHandler';
import { cacheTime, reqCache } from '../server';
import { getDepartmentsData } from '../controllers/department.controller';
import { Filter, FilterSchema } from '../types/request.types';
import Departments from '../models/department.model';


/* Checks if the cached data for departments' IDs exists in the
memory cache. If not, it calls the `getDepartmentsData` function to retrieve the data and stores it
in the cache.
The `tryCatch` function is used to handle any errors that may occur
during the execution of this middleware. */
export const getCacheDepartmentsID = tryCatch(async (req: omeaCitationsReqBody<Filter>, res: omeaCitationsRes<IDepartments[]>, next: NextFunction) => {
    const cachedData: IDepartments[] = cache.get(cacheKeysEnum.DepartmentsID);
    if (!cachedData) {
        // It will only run if filter is id
        const result = await Departments.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('id')), 'id']
            ],
            raw: true,
        });
        cache.put(cacheKeysEnum.DepartmentsID, result, cacheTime);
        reqCache.departmentsID = result;
    }
    req.cache = reqCache;
    next();
}, true);