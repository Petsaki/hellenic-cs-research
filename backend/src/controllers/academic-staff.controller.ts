import { Request } from 'express';
import { Op, Sequelize } from 'sequelize';
import { sendResponse } from '../api/common';
import Dep from '../models/dep.model';
import { IDep, depModel, omeaCitationsReqBody, omeaCitationsReqQuery, omeaCitationsRes } from '../types';
import { tryCatch } from '../utils/tryCatch';
import { Departments as DepartmentsReq, DepartmentsSchema } from '../types/request.types';

export const getAllPositions = async (): Promise<IDep[]> => {
  return await Dep.findAll({
    attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('position')), 'position']
    ],
    raw: true,
  });
};

export const getPositions = tryCatch(async (req: omeaCitationsReqBody<undefined>, res: omeaCitationsRes<IDep[]>) => {
    const positions = req.cache.position;
    res.json(sendResponse<IDep[]>(200,'All good.', positions));
});

// It can be a generic controller that it will accept 2 fields for the body
// The second field it will be the column that i want to sum with
export const getPositionsCountByDepartment = tryCatch(async (req: omeaCitationsReqBody<DepartmentsReq>, res: omeaCitationsRes<IPositionsCountByDepartment[]>) => {
    const {departments}: DepartmentsReq = DepartmentsSchema.parse(req.body);
    console.log(departments);

    let where = {};
    if (departments && departments.length > 0) {
      where = {
        inst: departments
      };
    }

    const result = await Dep.findAll({
      attributes: [
        'inst',
        'position',
        [Sequelize.fn('count', Sequelize.col('position')), 'count']
      ],
      group: ['inst', 'position'],
      where,
      raw: true,
    }) as DepCountResult[];

    const positions = req.cache.position;

    const positionArray = positions.map((position) => position.position)
      .filter((position) => position !== undefined && position !== null) as string[];

    console.log(positionArray);
      
    // Create a map to hold the counts for each inst
    const countsByInst = new Map<string, Record<string, number>>();
    
    // Loop through the result and add the counts to the map
    for (const { inst, position, count } of result) {
      if (!countsByInst.has(inst)) {
        countsByInst.set(inst, {});
      }
    
      /* `The `!` operator is used to assert that the object value is not null or undefined. */
      const counts = countsByInst.get(inst)!;
      counts[position] = count!;
    }
    
    // Add 0 counts for any missing positions for each inst
    for (const [inst, counts] of countsByInst) {
      for (const position of positionArray) {
        if (!(position in counts)) {
          counts[position] = 0;
        }
      }
    }
      
    console.log(countsByInst);
    const countByInstArr = Array.from(countsByInst, ([inst, positions]) => ({ inst, positions }));
    
    res.json(sendResponse<IPositionsCountByDepartment[]>(200,'All good.', countByInstArr));
});

export interface IPositionsCountByDepartment {
  inst: string;
  positions: Record<string, number>;
}

interface DepCountResult {
  inst: string;
  position: string;
  count?: number;
}