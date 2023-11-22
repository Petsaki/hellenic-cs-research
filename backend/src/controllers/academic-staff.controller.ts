import { Sequelize } from 'sequelize';
import { sendResponse } from '../api/common';
import Dep from '../models/dep.model';
import { IDep, omeaCitationsReqBody, omeaCitationsReqQuery, omeaCitationsRes } from '../types';
import { tryCatch } from '../utils/tryCatch';
import { Departments as DepartmentsReq, DepartmentsSchema, PositionsCountByDepsRequest, PositionsCountByDepsSchema } from '../types/request.types';
import { IPositionsCountByDepartment } from '../types/response/academic-staff.type';
import { departmentsValidation } from '../utils/validators';

export const getAllPositions = async (): Promise<string[]> => {
  const positions = await Dep.findAll({
    attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('position')), 'position']
    ],
    raw: true,
  });

  return positions.map((dep) => dep.position);
};

export const getPositions = tryCatch(async (req: omeaCitationsReqBody<null>, res: omeaCitationsRes<string[]>) => {
    const positions = req.cache.position;
    res.json(sendResponse<string[]>(200,'All good.', positions));
});

// It can be a generic controller that it will accept 2 fields for the body
// The second field it will be the column that i want to sum with
export const getPositionsCountByDepartment = tryCatch(async (req: omeaCitationsReqQuery<PositionsCountByDepsRequest>, res: omeaCitationsRes<IPositionsCountByDepartment[]>) => {
    const {departmentsID: departmentsCache, position: positionsCache } = req.cache;
    const {departments: departmentsZod}: DepartmentsReq = PositionsCountByDepsSchema.parse(req.query);
    const departments = departmentsZod.split(',');

    // Validation - Check if departments exists in the database
    await departmentsValidation(departments, departmentsCache);
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
      for (const position of positionsCache) {
        if (!(position in counts)) {
          counts[position] = 0;
        }
      }
    }
      
    console.log(countsByInst);
    const countByInstArr = Array.from(countsByInst, ([inst, positions]) => ({ inst, positions }));
    
    res.json(sendResponse<IPositionsCountByDepartment[]>(200,'All good.', countByInstArr));
});

interface DepCountResult {
  inst: string;
  position: string;
  count?: number;
}