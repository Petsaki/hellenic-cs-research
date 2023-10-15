import { Router } from 'express';
import { getAcademicPositionTotals, getDepartment, getDepartments, getDepartmentsAcademicStaffData, getDepartmentsActiveYears, getDepartmentsAnalyticsData, getScholarlyProfiles, getStatistics, getStatisticsPerDepartments } from '../controllers/department.controller';
import { getCacheDepartmentsID } from '../middlewares/getDepartmentsID';
import { getCacheYearsRange } from '../middlewares/getYearsRange';
import { getCacheAllPositions } from '../middlewares/getAllPositions';

const router = Router();

router.post('/', getCacheDepartmentsID, getDepartments);

// Academic-staff data
router.post('/academicStaffData', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getDepartmentsAcademicStaffData);

// statistics
router.post('/statisticsPerDepartment', getCacheAllPositions, getCacheDepartmentsID, getStatisticsPerDepartments);
router.post('/statistics', getCacheAllPositions, getCacheDepartmentsID, getStatistics);

// Active Years
router.post('/active-years', getCacheAllPositions, getCacheDepartmentsID, getDepartmentsActiveYears);

// department-analytics
router.post('/departmentAnalytics', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getDepartmentsAnalyticsData);


// citations and publications per academic position per department
router.get('/academicPositionTotals', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getAcademicPositionTotals);

// citations and publicattions per staff per department 
router.get('/scholarlyProfiles', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getScholarlyProfiles);

router.get('/:id', getDepartment);

export default router;