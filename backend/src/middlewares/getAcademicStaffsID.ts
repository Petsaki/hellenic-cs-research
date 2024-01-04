import { NextFunction } from 'express';
import cache from 'memory-cache';
import { cacheKeysEnum, omeaCitationsReqBody, omeaCitationsReqQuery, omeaCitationsRes } from '../types';
import { tryCatch } from '../utils/tryCatch';
import { Sequelize } from 'sequelize';
import { cacheTime, reqCache } from '../server';
import { AcademicDataAcademicStaffPaginationRequest } from '../types/request.types';
import Dep from '../models/dep.model';

export const getCacheAcademicStaffID = tryCatch(async (req: omeaCitationsReqQuery<AcademicDataAcademicStaffPaginationRequest>, res: omeaCitationsRes<unknown>, next: NextFunction) => {
    const cachedData: string[] = cache.get(cacheKeysEnum.AcademicStaffID);
    if (!cachedData && req.query.academic_staff) {
        const result = await Dep.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('gsid')), 'id'],
            ],
            raw: true,
        });
        
        const academicStaffIDs = result.map((dep) => dep.id)
        cache.put(cacheKeysEnum.AcademicStaffID, academicStaffIDs, cacheTime);
        reqCache.academicStaffID = academicStaffIDs;
    }
    req.cache = reqCache;
    next();
}, true);