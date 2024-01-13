import { Router } from 'express';
import { getYearsRange } from '../controllers/years_range.controller';
import { getCacheYearsRange } from '../middlewares/getYearsRange';

const router = Router();

/**
 * @openapi
 * /api/yearsRange:
 *   get: 
 *     description: Returns the years range of the database
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
 *                 - 1982
 *                 - 1983
 *                 - 1984
 *                 - 1985
 *                 - 1986
 *                 - 1987
 *                 - 1988
 *                 - 1989
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
router.get('/', getCacheYearsRange, getYearsRange);

export default router;