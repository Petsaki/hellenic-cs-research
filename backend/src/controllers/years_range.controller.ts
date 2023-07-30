import { QueryTypes } from "sequelize";
import sequelize from "../db/connection";
import { tryCatch } from "../utils/tryCatch";
import { omeaCitationsReqBody, omeaCitationsRes } from "../types";
import { sendResponse } from "../api/common";



export const getYearsRangeQuery = async (): Promise<{year: number}[]> => {

    const unionQuery = `
        SELECT DISTINCT cyear FROM (
        SELECT cyear FROM publications
        UNION
        SELECT cyear FROM citations
        ) AS unioned_years
        WHERE cyear >= 1
        ORDER BY cyear ASC
    `;

    const uniqueYears = await sequelize.query(unionQuery,
        { 
            type: QueryTypes.SELECT,
    });

    // Map the result to rename the 'cyear' property to 'year'
    // MARIOS TODO - Change it to return only an array of number (You have to fix it at frontend too)
    return uniqueYears.map((item: any) => {return {year: item.cyear}});
};

export const getYearsRange = tryCatch(async (req: omeaCitationsReqBody<unknown>, res: omeaCitationsRes<{year: number}[]>) => {
    const yearsRange = req.cache.yearsRange;
    res.json(sendResponse<{year: number}[]>(200,'All good.', yearsRange));
});