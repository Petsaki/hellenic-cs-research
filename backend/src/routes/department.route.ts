import { Router } from 'express';
import { getDepartment, getDepartments, getDepartmentsAcademicStaffData, getDepartmentsActiveYears, getStatistics, getStatisticsPerDepartments } from '../controllers/department.controller';
import { getCacheDepartmentsID } from '../middlewares/getDepartmentsID';
import { getCacheYearsRange } from '../middlewares/getYearsRange';
import { getCacheAllPositions } from '../middlewares/getAllPositions';

const router = Router();

router.post('/', getCacheDepartmentsID, getDepartments);
router.get('/:id', getDepartment);

// Academic-staff data
router.post('/academicStaffData', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getDepartmentsAcademicStaffData);

// statistics
router.post('/statisticsPerDepartment', getCacheAllPositions, getCacheDepartmentsID, getStatisticsPerDepartments);
router.post('/statistics', getCacheAllPositions, getCacheDepartmentsID, getStatistics);

// Active Years
router.post('/active-years', getCacheAllPositions, getCacheDepartmentsID, getDepartmentsActiveYears);

export default router;