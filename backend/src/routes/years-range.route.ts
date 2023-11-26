import { Router } from 'express';
import { getYearsRange } from '../controllers/years_range.controller';
import { getCacheYearsRange } from '../middlewares/getYearsRange';

const router = Router();

/** 
 * @openapi
 * /api/years-range/:
 *   get: 
 *     description: Returns the years range of the database
 *     responses:  
 *       200: 
 *         description: Success
 *     tags:
 *       - OMEA
 *   
 */ 
router.get('/', getCacheYearsRange, getYearsRange);

export default router;