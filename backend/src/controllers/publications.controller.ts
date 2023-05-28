import { Request } from 'express';
import { Op, Sequelize } from 'sequelize';
import { sendResponse } from '../api/common';
import Publications from '../models/publication.model';
import { IPublications, omeaCitationsReq, omeaCitationsReqBody, omeaCitationsRes } from '../types';
import { tryCatch } from '../utils/tryCatch';

export const getPublications = tryCatch(async (req: omeaCitationsReqBody<unknown>, res: omeaCitationsRes<IPublications[]>) => {
    const publicationsList = await Publications.findAll();
    res.json(sendResponse<IPublications[]>(200, 'All good.', publicationsList));
});

export const getPublicationsYearsRange = tryCatch(async (req: omeaCitationsReqBody<unknown>, res: omeaCitationsRes<IPublications[]>) => {
    const yearsRange = req.cache.yearsRange;
    res.json(sendResponse<IPublications[]>(200,'All good.', yearsRange));
});

export const getYearsRange = async (): Promise<IPublications[]> => {
    return await Publications.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('cyear')), 'year']
        ],
        // Be careful with renaming fields of models!
        // Here you must say the renaming field name and not the original name of the database's field!
        where: {
            year: {
                [Op.gt]: 0,
            }
        },
        order: [
            ['cyear', 'ASC'],
        ],
    });
};
  