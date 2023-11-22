import { Router } from 'express';
import { getPositions, getPositionsCountByDepartment } from '../controllers/academic-staff.controller';
import { getCacheAllPositions } from '../middlewares/getAllPositions';
import { getCacheDepartmentsID } from '../middlewares/getDepartmentsID';

const router = Router();

/** 
 * @openapi
 * /api/academic-staff/positions:
 *   get: 
 *     description: Returns all positions that a academic staff can be.
 *     responses:  
 *       200: 
 *         description: It's all good man!
 *     tags:
 *       - OMEA
 *   
 */ 
router.get('/positions', getCacheAllPositions, getPositions);

/** 
 * @openapi
 * /api/academic-staff/positionsSumByDepartment:
 *   get: 
 *     description: Returns all positions sums for the every department.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: true
 *         scema:
 *           type: string
 *         description: Department's ids. Accepts multi values with comma(,).
 *     responses:  
 *       200: 
 *         description: It's all good man!
 *     tags:
 *       - OMEA
 *   
 */
router.get('/positionsSumByDepartment', getCacheAllPositions, getCacheDepartmentsID, getPositionsCountByDepartment);

export default router;