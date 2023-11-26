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
 *         schema:
 *           type: string
 *         description: What objects to return
 *     responses:  
 *       200: 
 *         description: Success 
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
 *         schema:
 *           type: string
 *         description: Department's ids. Accepts multi values with comma(,).
 *       - name: years
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Years range. Accepts multi values with comma(,). Max 2 values.
 *       - name: page
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *         description: Page's number.
 *       - name: size
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *         description: Offset's number.
 *       - name: positions
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Academic positions. Accepts multi values with comma(,).
 *     responses:  
 *       200: 
 *         description: Success 
 *     tags:
 *       - OMEA
 *   
 */
// Academic-staff data
router.get('/academicStaffData', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getDepartmentsAcademicStaffData);

/** 
 * @openapi
 * /api/departments/statisticsPerDepartment:
 *   get: 
 *     description: Returns an array of selected departments statistics.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Departments. Accepts multi values with comma(,).
 *       - name: positions
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Academic positions. Accepts multi values with comma(,).
 *     responses:  
 *       200: 
 *         description: Success 
 *     tags:
 *       - OMEA
 *   
 */ 
// statistics
router.get('/statisticsPerDepartment', getCacheAllPositions, getCacheDepartmentsID, getStatisticsPerDepartments);

/** 
 * @openapi
 * /api/departments/statistics:
 *   get: 
 *     description: Returns aggregated statistics for all selected departments and positions.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Departments. Accepts multi values with comma(,).
 *       - name: positions
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Academic positions. Accepts multi values with comma(,).
 *     responses:  
 *       200: 
 *         description: Success 
 *     tags:
 *       - OMEA
 *   
 */ 
router.get('/statistics', getCacheAllPositions, getCacheDepartmentsID, getStatistics);

/** 
 * @openapi
 * /api/departments/active-years:
 *   get: 
 *     description: Returns the active years of selected departments. Active year is a year that it will have at least 1 citation or publication.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Departments. Accepts multi values with comma(,).
 *       - name: positions
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Academic positions. Accepts multi values with comma(,).
 *     responses:  
 *       200: 
 *         description: Success 
 *     tags:
 *       - OMEA
 *   
 */ 
// Active Years
router.get('/active-years', getCacheAllPositions, getCacheDepartmentsID, getDepartmentsActiveYears);

/** 
 * @openapi
 * /api/departments/departmentAnalytics:
 *   get: 
 *     description: Return an array of analytics data for every selected department.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Department's ids. Accepts multi values with comma(,). If is empty it will return for all.
 *       - name: years
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Years range. Accepts multi values with comma(,). Max 2 values.
 *       - name: positions
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Academic positions. Accepts multi values with comma(,). If is empty it will return for all.
 *     responses:  
 *       200: 
 *         description: Success 
 *     tags:
 *       - OMEA
 *   
 */
// department-analytics
router.get('/departmentAnalytics', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getDepartmentsAnalyticsData);

/** 
 * @openapi
 * /api/departments/academicPositionTotals:
 *   get: 
 *     description: Return an array of citations and publications by position by department.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Department's ids. Accepts multi values with comma(,). If is empty it will return for all.
 *       - name: years
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Years range. Accepts multi values with comma(,). Max 2 values.
 *       - name: positions
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic positions. Accepts multi values with comma(,). If is empty it will return for all.
 *     responses:  
 *       200: 
 *         description: Success 
 *     tags:
 *       - OMEA
 *   
 */
// citations and publications per academic position per department
router.get('/academicPositionTotals', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getAcademicPositionTotals);

/** 
 * @openapi
 * /api/departments/scholarlyProfiles:
 *   get: 
 *     description: Return an array of the publications and citations for the selected departments, positions and years range per department.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Department's ids. Accepts multi values with comma(,). If is empty it will return for all.
 *       - name: years
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Years range. Accepts multi values with comma(,). Max 2 values.
 *       - name: positions
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic positions. Accepts multi values with comma(,). If is empty it will return for all.
 *     responses:  
 *       200: 
 *         description: Success 
 *     tags:
 *       - OMEA
 *   
 */
// citations and publicattions per staff per department 
router.get('/scholarlyProfiles', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getScholarlyProfiles);

/** 
 * @openapi
 * /api/departments/academicStaffResearchSummary:
 *   get: 
 *     description: Return an array of the publications and citations for the selected departments, positions and years range per department.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Department's ids. Accepts multi values with comma(,). If is empty it will return for all.
 *       - name: years
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Years range. Accepts multi values with comma(,). Max 2 values.
 *       - name: positions
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic positions. Accepts multi values with comma(,). If is empty it will return for all.
 *     responses:  
 *       200: 
 *         description: Success 
 *     tags:
 *       - OMEA
 *   
 */
//  Academic staff's citations and publications per academic position per department
// IS THE SAME DATA AS /scholarlyProfiles BUT DIFFERENT STRUCTURE AT DATA
router.get('/academicStaffResearchSummary', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getAcademicStaffResearchSummary);

// Only for test. Is useless because the / can return the same value as this
router.get('/:id', getDepartment);

export default router;