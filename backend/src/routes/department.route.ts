import { Router } from 'express';
import { getDepartment, getDepartments, getStatistics, getStatisticsPerDepartments } from '../controllers/department.controller';
import { getCacheDepartmentsID } from '../middlewares/getDepartmentsID';
import { getCacheYearsRange } from '../middlewares/getYearsRange';
import { getCacheAllPositions } from '../middlewares/getAllPositions';

const router = Router();

router.post('/',getCacheDepartmentsID, getDepartments);
router.get('/:id', getDepartment);
// statistics
router.post('/statisticsPerDepartment', getCacheYearsRange, getCacheAllPositions, getStatisticsPerDepartments);
router.post('/statistics', getCacheYearsRange, getCacheAllPositions, getStatistics);

export default router;