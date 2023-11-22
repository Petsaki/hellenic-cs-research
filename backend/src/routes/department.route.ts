import { Router } from 'express';
import { getAcademicPositionTotals, getAcademicStaffResearchSummary, getDepartment, getDepartments, getDepartmentsAcademicStaffData, getDepartmentsActiveYears, getDepartmentsAnalyticsData, getScholarlyProfiles, getStatistics, getStatisticsPerDepartments } from '../controllers/department.controller';
import { getCacheDepartmentsID } from '../middlewares/getDepartmentsID';
import { getCacheYearsRange } from '../middlewares/getYearsRange';
import { getCacheAllPositions } from '../middlewares/getAllPositions';

const router = Router();

/** 
 * @openapi
 * /api/departments/:
 *   get: 
 *     description: Returns an array of Departments. Can modify the object that returns base of filter query
 *     parameters:
 *       - name: filter
 *         in: query
 *         required: false
 *         scema:
 *           type: string
 *         description: What objects to return
 *     responses:  
 *       200: 
 *         description: It's all good man! 
 *     tags:
 *       - OMEA
 *   
 */ 
router.get('/', getCacheDepartmentsID, getDepartments);

/** 
 * @openapi
 * /api/departments/academicStaffData:
 *   get: 
 *     description: Return an object with the data of academic staff citations/publications per year.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: true
 *         scema:
 *           type: string
 *         description: Department's ids. Accepts multi values with comma(,).
 *       - name: years
 *         in: query
 *         required: true
 *         scema:
 *           type: string
 *         description: Years range. Accepts multi values with comma(,). Max 2 values.
 *       - name: page
 *         in: query
 *         required: true
 *         scema:
 *           type: number
 *         description: Page's number.
 *       - name: size
 *         in: query
 *         required: true
 *         scema:
 *           type: number
 *         description: Offset's number.
 *       - name: positions
 *         in: query
 *         required: false
 *         scema:
 *           type: string
 *         description: Academic positions. Accepts multi values with comma(,).
 *     responses:  
 *       200: 
 *         description: It's all good man! 
 *     tags:
 *       - OMEA
 *   
 */
// Academic-staff data
router.get('/academicStaffData', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getDepartmentsAcademicStaffData);

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

//  Academic staff's citations and publications per academic position per department
router.get('/academicStaffResearchSummary', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getAcademicStaffResearchSummary);

router.get('/:id', getDepartment);

export default router;