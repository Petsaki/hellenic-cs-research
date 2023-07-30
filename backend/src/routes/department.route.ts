import { Router } from 'express';
import { getDepartment, getDepartments, getDepartmentsActiveYears, getStatistics, getStatisticsPerDepartments } from '../controllers/department.controller';
import { getCacheDepartmentsID } from '../middlewares/getDepartmentsID';
import { getCacheYearsRange } from '../middlewares/getYearsRange';
import { getCacheAllPositions } from '../middlewares/getAllPositions';

const router = Router();

router.post('/',getCacheDepartmentsID, getDepartments);
router.get('/:id', getDepartment);

// statistics
router.post('/statisticsPerDepartment', getCacheAllPositions, getStatisticsPerDepartments);
router.post('/statistics', getCacheAllPositions, getStatistics);

// Active Years
router.post('/active-years', getCacheAllPositions, getDepartmentsActiveYears);

export default router;