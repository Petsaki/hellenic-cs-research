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
 *     description: Returns an array of Departments. Can modify the object that returns based on the filter query.
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
 *                           id:
 *                             type: string
 *                             nullable: true
 *                           deptname:
 *                             type: string
 *                             nullable: true
 *                           university:
 *                             type: string
 *                             nullable: true
 *                           urldep:
 *                             type: string
 *                             nullable: true
 *                           urledip:
 *                             type: string
 *                             nullable: true
 *                           url:
 *                             type: string
 *                             nullable: true
 *             example:
 *               code: 200
 *               data:
 *                 - id: "iee@ihu"
 *                   deptname: "Τμήμα Μηχανικών Πληροφορικής και Ηλεκτρονικών Συστημάτων"
 *                   university: "Διεθνές Πανεπιστήμιο της Ελλάδος"
 *                   urldep: "https://www.iee.ihu.gr/en/staff_category/faculty-member/"
 *                   urledip: "https://www.iee.ihu.gr/en/staff_category/edu-staff/"
 *                   url: "https://www.iee.ihu.gr"
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
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
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           position:
 *                             type: string
 *                           inst:
 *                             type: string
 *                           hindex:
 *                             type: integer
 *                           publications:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 year:
 *                                   type: integer
 *                                 count:
 *                                   type: integer
 *                             nullable: true
 *                           citations:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 year:
 *                                   type: integer
 *                                 count:
 *                                   type: integer
 *                             nullable: true
 *                           hindex5:
 *                             type: integer
 *                             nullable: true
 *                           citations5:
 *                             type: integer
 *                             nullable: true
 *                           publications5:
 *                             type: integer
 *                             nullable: true
 *                           publicationTotal:
 *                             type: integer
 *                             nullable: true
 *                           citationTotal:
 *                             type: integer
 *                             nullable: true
 *                           averagePublication:
 *                             type: integer
 *                             nullable: true
 *                           averageCitation:
 *                             type: integer
 *                             nullable: true
 *             example:
 *               code: 200
 *               data:
 *                 - id: "AaBBccdD1112"
 *                   name: "Academic Staff"
 *                   position: "Assistant Professor"
 *                   inst: "iee@ihu"
 *                   hindex: 10
 *                   publications:
 *                     - year: 2022
 *                       count: 3
 *                   citations:
 *                     - year: 2022
 *                       count: 40
 *                   hindex5: 5
 *                   citations5: 186
 *                   publications5: 14
 *                   publicationTotal: 3
 *                   citationTotal: 40
 *                   averagePublication: 3
 *                   averageCitation: 40
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
 */
// Academic-staff data
router.get('/academicStaffData', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getDepartmentsAcademicStaffData); // ΑΥΤΟ

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
 *                           avg_hindex:
 *                             type: number
 *                           sum_publications:
 *                             type: integer
 *                           sum_citations:
 *                             type: integer
 *                           avg_hindex5:
 *                             type: number
 *                           sum_publications5:
 *                             type: integer
 *                           sum_citations5:
 *                             type: integer
 *                           avg_publications_per_staff:
 *                             type: number
 *                           avg_citations_per_staff:
 *                             type: number
 *                           avg_publications_per_staff_per_year:
 *                             type: number
 *                           avg_citations_per_staff_per_year:
 *                             type: number
 *             example:
 *               code: 200
 *               data:
 *                 - inst: "iee@ihu"
 *                   avg_hindex: 11.43
 *                   sum_publications: 1748
 *                   sum_citations: 26728
 *                   avg_hindex5: 7.57
 *                   sum_publications5: 354
 *                   sum_citations5: 11824
 *                   avg_publications_per_staff: 58.27
 *                   avg_citations_per_staff: 890.93
 *                   avg_publications_per_staff_per_year: 1.71
 *                   avg_citations_per_staff_per_year: 26.2
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
 */
// statistics
router.get('/statisticsPerDepartment', getCacheAllPositions, getCacheDepartmentsID, getStatisticsPerDepartments); // ΑΥΤΟ

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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         avg_hindex:
 *                           type: number
 *                         sum_publications:
 *                           type: integer
 *                         sum_citations:
 *                           type: integer
 *                         avg_hindex5:
 *                           type: number
 *                         sum_publications5:
 *                           type: integer
 *                         sum_citations5:
 *                           type: integer
 *                         avg_publications_per_staff:
 *                           type: number
 *                         avg_citations_per_staff:
 *                           type: number
 *                         avg_publications_per_staff_per_year:
 *                           type: number
 *                         avg_citations_per_staff_per_year:
 *                           type: number
 *             example:
 *               code: 200
 *               data:
 *                 avg_hindex: 11.43
 *                 sum_publications: 1748
 *                 sum_citations: 26728
 *                 avg_hindex5: 7.57
 *                 sum_publications5: 354
 *                 sum_citations5: 11824
 *                 avg_publications_per_staff: 58.27
 *                 avg_citations_per_staff: 890.93
 *                 avg_publications_per_staff_per_year: 1.71
 *                 avg_citations_per_staff_per_year: 26.2
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
 */
router.get('/statistics', getCacheAllPositions, getCacheDepartmentsID, getStatistics); // ΑΥΤΟ

/**
 * @openapi
 * /api/departments/active-years:
 *   get: 
 *     description: Returns the active years of selected departments. Active year is a year that will have at least 1 citation or publication.
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
 *                         type: integer
 *             example:
 *               code: 200
 *               data:
 *                 - 1983
 *                 - 1990
 *                 - 1991
 *                 - 1992
 *                 - 1993
 *                 - 1994
 *                 - 1995
 *                 - 1996
 *                 - 1997
 *                 - 1998
 *                 - 1999
 *                 - 2000
 *                 - 2001
 *                 - 2002
 *                 - 2003
 *                 - 2004
 *                 - 2005
 *                 - 2006
 *                 - 2007
 *                 - 2008
 *                 - 2009
 *                 - 2010
 *                 - 2011
 *                 - 2012
 *                 - 2013
 *                 - 2014
 *                 - 2015
 *                 - 2016
 *                 - 2017
 *                 - 2018
 *                 - 2019
 *                 - 2020
 *                 - 2021
 *                 - 2022
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
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
 *         description: Department's ids. Accepts multi values with comma(,). If empty, it will return for all.
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
 *         description: Academic positions. Accepts multi values with comma(,). If empty, it will return for all.
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
 *                           totalCitations:
 *                             type: integer
 *                           totalPublications:
 *                             type: integer
 *                           staffCount:
 *                             type: integer
 *                           avgPublicationsPerStaff:
 *                             type: number
 *                           avgCitationsPerStaff:
 *                             type: number
 *                           maxPublicationsCount:
 *                             type: integer
 *                           minPublicationsCount:
 *                             type: integer
 *                           maxCitationsCount:
 *                             type: integer
 *                           minCitationsCount:
 *                             type: integer
 *                           cvPublications:
 *                             type: number
 *                           cvCitations:
 *                             type: number
 *                           avgHIndex:
 *                             type: integer
 *                           minHIndex:
 *                             type: integer
 *                           maxHIndex:
 *                             type: integer
 *             example:
 *               code: 200
 *               data:
 *                 - inst: "iee@ihu"
 *                   totalCitations: 1993
 *                   totalPublications: 59
 *                   staffCount: 30
 *                   avgPublicationsPerStaff: 51.2
 *                   avgCitationsPerStaff: 874.7
 *                   maxPublicationsCount: 14
 *                   minPublicationsCount: 1
 *                   maxCitationsCount: 475
 *                   minCitationsCount: 1
 *                   cvPublications: 103.3
 *                   cvCitations: 159.6
 *                   avgHIndex: 12
 *                   minHIndex: 2
 *                   maxHIndex: 29
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
 */
// department-analytics
router.get('/departmentAnalytics', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getDepartmentsAnalyticsData); // ΑΥΤΟ

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
 *         description: Department's ids. Accepts multi values with comma(,). If empty, it will return for all.
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
 *         description: Academic positions. Accepts multi values with comma(,). If empty, it will return for all.
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
 *                           researchPerPosition:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 position:
 *                                   type: string
 *                                 citations:
 *                                   type: integer
 *                                 publications:
 *                                   type: integer
 *             example:
 *               code: 200
 *               data:
 *                 - inst: "iee@ihu"
 *                   researchPerPosition:
 *                     - position: "Professor"
 *                       citations: 1193
 *                       publications: 31
 *                     - position: "Associate Professor"
 *                       citations: 176
 *                       publications: 10
 *                     - position: "Assistant Professor"
 *                       citations: 597
 *                       publications: 17
 *                     - position: "Lecturer"
 *                       citations: 0
 *                       publications: 0
 *                     - position: "Lab Lecturer"
 *                       citations: 27
 *                       publications: 1
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
 */
// citations and publications per academic position per department
router.get('/academicPositionTotals', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getAcademicPositionTotals); // ΑΥΤΟ

/**
 * @openapi
 * /api/departments/scholarlyProfiles:
 *   get: 
 *     description: Return an array of the publications and citations for the selected departments, positions, and years range per department.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Department's ids. Accepts multi values with comma(,). If empty, it will return for all.
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
 *         description: Academic positions. Accepts multi values with comma(,). If empty, it will return for all.
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
 *                           departmentStats:
 *                             type: object
 *                             properties:
 *                               totalCitations:
 *                                 type: integer
 *                               totalPublications:
 *                                 type: integer
 *                               publicationsTotalPerStaff:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                     total:
 *                                       type: integer
 *                                     name:
 *                                       type: string
 *                               citationsTotalPerStaff:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                     total:
 *                                       type: integer
 *                                     name:
 *                                       type: string
 *             example:
 *               code: 200
 *               data:
 *                 - inst: "iee@ihu"
 *                   departmentStats:
 *                     totalCitations: 1993
 *                     totalPublications: 59
 *                     publicationsTotalPerStaff:
 *                       - id: "ABC123456789"
 *                         total: 3
 *                         name: "Academic Staff"
 *                     citationsTotalPerStaff:
 *                       - id: "ABC123456789"
 *                         total: 24
 *                         name: "Academic Staff"
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
 */
// citations and publicattions per staff per department 
router.get('/scholarlyProfiles', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getScholarlyProfiles); // ΑΥΤΟ

/**
 * @openapi
 * /api/departments/academicStaffResearchSummary:
 *   get: 
 *     description: Return an array of the publications and citations for the selected departments, positions, and years range per department.
 *     parameters:
 *       - name: departments
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Department's ids. Accepts multi values with comma(,). If empty, it will return for all.
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
 *         description: Academic positions. Accepts multi values with comma(,). If empty, it will return for all.
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
 *                           research:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 publications:
 *                                   type: integer
 *                                 citations:
 *                                   type: integer
 *             example:
 *               code: 200
 *               data:
 *                 - inst: "iee@ihu"
 *                   research:
 *                     - id: "ABC123456789"
 *                       name: "Academic Staff"
 *                       publications: 10
 *                       citations: 354
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
 */
//  Academic staff's citations and publications per academic position per department
// IS THE SAME DATA AS /scholarlyProfiles BUT DIFFERENT STRUCTURE AT DATA
router.get('/academicStaffResearchSummary', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getAcademicStaffResearchSummary); // ΑΥΤΟ

// Only for test. Is useless because the / can return the same value as this
router.get('/:id', getDepartment);

export default router;