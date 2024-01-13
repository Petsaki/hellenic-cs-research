import { Router } from 'express';
import { getAcademicPositionTotals, getAcademicStaffResearchSummary, getDepartment, getDepartments, getDepartmentsAcademicStaffByStaffData, getDepartmentsAcademicStaffData, getDepartmentsActiveYears, getDepartmentsAnalyticsData, getScholarlyProfiles, getStatistics, getStatisticsPerDepartments } from '../controllers/department.controller';
import { getCacheDepartmentsID } from '../middlewares/getDepartmentsID';
import { getCacheYearsRange } from '../middlewares/getYearsRange';
import { getCacheAllPositions } from '../middlewares/getAllPositions';
import { getCacheAcademicStaffID } from '../middlewares/getAcademicStaffsID';

const router = Router();

/**
 * @openapi
 * /api/departments:
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
 * /api/departments/academicStaffData/byDepartmentIds:
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
 *       - name: unknown_year
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: If true then it will include the publications with unknown year.
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
 *                           publication_total:
 *                             type: integer
 *                             nullable: true
 *                           citation_total:
 *                             type: integer
 *                             nullable: true
 *                           average_publication:
 *                             type: integer
 *                             nullable: true
 *                           average_citation:
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
 *                   publication_total: 3
 *                   citation_total: 40
 *                   average_publication: 3
 *                   average_citation: 40
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
 */
// Academic-staff data by Department IDs
router.get('/academicStaffData/byDepartmentIds', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getDepartmentsAcademicStaffData);

/**
 * @openapi
 * /api/departments/academicStaffData/byStaffIds:
 *   get: 
 *     description: Return an object with the data of academic staff citations/publications per year.
 *     parameters:
 *       - name: academic_staff
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic staff ids. Accepts multi values with comma(,).
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
 *       - name: unknown_year
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: If true then it will include the publications with unknown year.
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
 *                           publication_total:
 *                             type: integer
 *                             nullable: true
 *                           citation_total:
 *                             type: integer
 *                             nullable: true
 *                           average_publication:
 *                             type: integer
 *                             nullable: true
 *                           average_citation:
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
 *                   publication_total: 3
 *                   citation_total: 40
 *                   average_publication: 3
 *                   average_citation: 40
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
 */
// Academic-staff data by Academic Staff IDs
router.get('/academicStaffData/byStaffIds', getCacheAllPositions, getCacheYearsRange, getCacheAcademicStaffID, getDepartmentsAcademicStaffByStaffData);

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
router.get('/statistics', getCacheAllPositions, getCacheDepartmentsID, getStatistics);

/**
 * @openapi
 * /api/departments/activeYears:
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
router.get('/activeYears', getCacheAllPositions, getCacheDepartmentsID, getDepartmentsActiveYears);

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
 *       - name: unknown_year
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: If true then it will include the publications with unknown year.
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
 *                           total_citations:
 *                             type: integer
 *                           total_publications:
 *                             type: integer
 *                           staff_count:
 *                             type: integer
 *                           avg_publications_per_staff:
 *                             type: number
 *                           avg_citations_per_staff:
 *                             type: number
 *                           max_publications_count:
 *                             type: integer
 *                           min_publications_count:
 *                             type: integer
 *                           max_citations_count:
 *                             type: integer
 *                           min_citations_count:
 *                             type: integer
 *                           cv_publications:
 *                             type: number
 *                           cv_citations:
 *                             type: number
 *                           avg_h_index:
 *                             type: integer
 *                           min_h_index:
 *                             type: integer
 *                           max_h_index:
 *                             type: integer
 *             example:
 *               code: 200
 *               data:
 *                 - inst: "iee@ihu"
 *                   total_citations: 1993
 *                   total_publications: 59
 *                   staff_count: 30
 *                   avg_publications_per_staff: 51.2
 *                   avg_citations_per_staff: 874.7
 *                   max_publications_count: 14
 *                   min_publications_count: 1
 *                   max_citations_count: 475
 *                   min_citations_count: 1
 *                   cv_publications: 103.3
 *                   cv_citations: 159.6
 *                   avg_h_index: 12
 *                   min_h_index: 2
 *                   max_h_index: 29
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
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
 *       - name: unknown_year
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: If true then it will include the publications with unknown year.
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
 *                           research_per_position:
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
 *                   research_per_position:
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
router.get('/academicPositionTotals', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getAcademicPositionTotals);

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
 *       - name: unknown_year
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: If true then it will include the publications with unknown year.
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
 *                           department_stats:
 *                             type: object
 *                             properties:
 *                               total_citations:
 *                                 type: integer
 *                               total_publications:
 *                                 type: integer
 *                               publications_total_per_staff:
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
 *                               citations_total_per_staff:
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
 *                   department_stats:
 *                     total_citations: 1993
 *                     total_publications: 59
 *                     publications_total_per_staff:
 *                       - id: "ABC123456789"
 *                         total: 3
 *                         name: "Academic Staff"
 *                     citations_total_per_staff:
 *                       - id: "ABC123456789"
 *                         total: 24
 *                         name: "Academic Staff"
 *               description: "Success"
 *               success: true
 *     tags:
 *       - OMEA
 */
// citations and publicattions per staff per department
router.get('/scholarlyProfiles', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getScholarlyProfiles);

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
 *       - name: unknown_year
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: If true then it will include the publications with unknown year.
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
router.get('/academicStaffResearchSummary', getCacheAllPositions, getCacheYearsRange, getCacheDepartmentsID, getAcademicStaffResearchSummary);

// Only for test. Is useless because the / can return the same value as this
router.get('/:id', getDepartment);

export default router;