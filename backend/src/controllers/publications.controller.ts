import { Request } from 'express';
import { Op, Sequelize } from 'sequelize';
import { sendResponse } from '../api/common';
import Publications from '../models/publication.model';
import { omeaCitationsRes, publicationsModel } from '../types';
import { tryCatch } from '../utils/tryCatch';

export const getPublications = tryCatch(async (req: Request, res: omeaCitationsRes<publicationsModel[]>) => {
    const publicationsList = await Publications.findAll();
    res.json(sendResponse<publicationsModel[]>(200, 'All good.', publicationsList));
});

export const getPublicationsYearsRange = tryCatch(async (req: Request, res: omeaCitationsRes<publicationsModel[]>) => {
    const department = await Publications.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('cyear')), 'year']
        ],
        where: {
            cyear: {
                [Op.gt]: 0,
            }
        },
        order: [
            ['cyear', 'ASC'],
        ],
    });
    res.json(sendResponse<publicationsModel[]>(200,'All good.', department));
});