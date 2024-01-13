import { QueryTypes } from "sequelize";
import sequelize from "../db/connection";
import { tryCatch } from "../utils/tryCatch";
import { omeaCitationsReqBody, omeaCitationsRes } from "../types";
import { sendResponse } from "../api/common";



export const getYearsRangeQuery = async (): Promise<number[]> => {

    const unionQuery = `
        SELECT DISTINCT cyear FROM (
        SELECT cyear FROM publications
        UNION
        SELECT cyear FROM citations
        ) AS unioned_years
        WHERE cyear >= 1
        ORDER BY cyear ASC
    `;
    
    const uniqueYears: {cyear: number}[] = await sequelize.query(unionQuery,
        { 
            type: QueryTypes.SELECT,
    });
    
    return uniqueYears.map((item) => item.cyear);
};

export const getYearsRange = tryCatch(async (req: omeaCitationsReqBody<unknown>, res: omeaCitationsRes<number[]>) => {
    const yearsRange = req.cache.yearsRange;
    res.json(sendResponse<number[]>(200,'All good.', yearsRange));
});