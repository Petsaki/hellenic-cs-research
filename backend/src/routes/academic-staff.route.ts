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
 *         description: Success
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
 *         schema:
 *           type: string
 *         description: Department's ids. Accepts multi values with comma(,).
 *     responses:  
 *       200: 
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           inst:
 *                             type: string
 *                           positions:
 *                             type: object
 *                             properties:
 *                               Assistant Professor:
 *                                 type: integer
 *                               Associate Professor:
 *                                 type: integer
 *                               Lab Lecturer:
 *                                 type: integer
 *                               Professor:
 *                                 type: integer
 *                               Lecturer:
 *                                 type: integer
 *             example:
 *               code: 200
 *               data:
 *                 - inst: "iee@ihu"
 *                   positions:
 *                     Assistant Professor: 6
 *                     Associate Professor: 5
 *                     Lab Lecturer: 3
 *                     Professor: 16
 *                     Lecturer: 0
 *               description: "All good."
 *               success: true
 *     tags:
 *       - OMEA
 *   
 */
router.get('/positionsSumByDepartment', getCacheAllPositions, getCacheDepartmentsID, getPositionsCountByDepartment);

export default router;