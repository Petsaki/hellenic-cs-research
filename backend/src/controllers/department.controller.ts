import { Op, QueryTypes, Sequelize, WhereOptions } from 'sequelize';
import { sendResponse } from '../api/common';
import Departments from '../models/department.model';
import { omeaCitationsRes, omeaCitationsReqBody, IDepartments, IDep, omeaCitationsReqQuery, omeaCitationsReqBodyQuery, DepartmentsStaticStatsCache, cacheKeysEnum, DepartmentsDynamicStatsIDs } from '../types';
import { tryCatch } from '../utils/tryCatch';
import { StatisticReq, StatisticReqSchema, Filter, FilterSchema, AcademicDataRequest, AcademicDataSchema, DepartmentsAnalyticsReqSchema, DepartmentsAnalyticsReq, AcademicPositionTotalsSchema, AcademicPositionTotalsRequest, AcademicStaffResearchSummaryRequest, AcademicStaffResearchSummarySchema, AcademicDataPaginationSchema, AcademicDataPaginationRequest } from '../types/request.types';
import Dep from '../models/dep.model';
import sequelize from '../db/connection';
import Publications from '../models/publication.model';
import Citations from '../models/citation.model';
import { departmentsValidation, positionsValidation, yearsValidation } from '../utils/validators';
import { AcademicData, DepartmentsDynamicStats, IAcademicPositionTotals, IAcademicStaffData, IAcademicStaffResearchSummary, IStatistics, IStatisticsPerDepartment, StaffResearchSummary } from '../types/response/department.type';
import cache from 'memory-cache';
import { cacheTime, reqCache } from '../server';

const decimalPlaces = '2';

// I can put type on getDepartments if i return the res.json but is useless because express and my custom types already checks what i am going to return
export const getDepartments = tryCatch(async (req: omeaCitationsReqBody<Filter>, res: omeaCitationsRes<IDepartments[]>) => {
    const {filter}: Filter = FilterSchema.parse(req.body);

    if (filter === 'id') {
        return res.json(sendResponse<IDepartments[]>(200, 'All good.', req.cache.departmentsID));
    }
    const deparmentsList = await getDepartmentsData(filter);
    
    return res.json(sendResponse<IDepartments[]>(200, 'All good.', deparmentsList));
});

export const getDepartment = tryCatch(async (req: omeaCitationsReqBodyQuery<{id:string}, {test: string, test2: string}>, res: omeaCitationsRes<IDepartments>) => {
    const {id} = req.params;
    const {test, test2} = req.query;
    console.log(test);
    console.log(test2);
    
    // const department = await Departments.findByPk(id,{rejectOnEmpty: true});
    const department = await Departments.findByPk(id);
    if (!department) {
        throw new Error(`Deparment with this id: ${id}, does not exists.`);
    }

    return res.json(sendResponse<IDepartments>(200,'All good.', department));
});

export const getDepartmentsData = async (filter: string): Promise<IDepartments[]> => {
    if (filter) {
        return await Departments.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col(filter)), filter]
            ]
        });
    }
    
    return await Departments.findAll();
};


// STATISTICS
export const getStatistics = tryCatch(async (req: omeaCitationsReqBody<StatisticReq>, res: omeaCitationsRes<IStatistics>) => {
    const {position: positionsCache, departmentsID: departmentsCache} = req.cache;
    const {departments, positions}: StatisticReq = StatisticReqSchema.parse(req.body);

    // Validation - Check if departments exists in the database
    await departmentsValidation(departments, departmentsCache);
    // Validation - Check if positions exists in the database
    if (positions) {
        positionsValidation(positions, positionsCache)
    }

    const sumYearsRange = (positions && positions.length > 0) ? (await activeYears(departments, positions)).length : (await activeYears(departments)).length;

    let where: WhereOptions<IDep> = {inst: departments};
    if (positions && positions.length > 0) {
        where = {...where, position: positions};
    }


    const sums = await Dep.findOne({
        attributes: [
            [Sequelize.fn('SUM', Sequelize.col('hindex')), 'hindex'],
            [Sequelize.fn('SUM', Sequelize.col('publications')), 'publications'],
            [Sequelize.fn('SUM', Sequelize.col('citations')), 'citations'],
            [Sequelize.fn('SUM', Sequelize.col('hindex5')), 'hindex5'],
            [Sequelize.fn('SUM', Sequelize.col('publications5')), 'publications5'],
            [Sequelize.fn('SUM', Sequelize.col('citations5')), 'citations5'],
            [Sequelize.fn('COUNT', Sequelize.col('inst')), 'inst'],
        ],
        where,
        raw: true,
    });
    
    let statistics: IStatistics = {
      avg_hindex: 0,
      sum_publications: 0,
      sum_citations: 0,
      avg_hindex5: 0,
      sum_publications5: 0,
      sum_citations5: 0,
      avg_publications_per_staff: 0,
      avg_citations_per_staff: 0,
      avg_publications_per_staff_per_year: 0,
      avg_citations_per_staff_per_year: 0,
    };
    
    if (sums) {
      const sumAcademicStaff = Number(sums.inst);
      statistics = {
        avg_hindex: Number(Math.round(parseFloat((sums.hindex / sumAcademicStaff) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces),
        sum_publications: sums.publications,
        sum_citations: sums.citations,
        avg_hindex5: Number(Math.round(parseFloat((sums.hindex5 / sumAcademicStaff) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces),
        sum_publications5: sums.publications5,
        sum_citations5: sums.citations5,
        avg_publications_per_staff: Number(Math.round(parseFloat((sums.publications / sumAcademicStaff) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces),
        avg_citations_per_staff: Number(Math.round(parseFloat((sums.citations / sumAcademicStaff) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces),
        avg_publications_per_staff_per_year: Number(Math.round(parseFloat((sums.publications / sumAcademicStaff / sumYearsRange) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces),
        avg_citations_per_staff_per_year: Number(Math.round(parseFloat((sums.citations / sumAcademicStaff / sumYearsRange) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces),
      }
    }
  
    res.json(sendResponse<IStatistics>(200,'All good.', statistics));
});
  
export const getStatisticsPerDepartments = tryCatch(async (req: omeaCitationsReqBody<StatisticReq>, res: omeaCitationsRes<IStatisticsPerDepartment[]>) => {
    const {position: positionsCache, departmentsID: departmentsCache} = req.cache;
    const {departments, positions}: StatisticReq = StatisticReqSchema.parse(req.body);
    
    // Validation - Check if departments exists in the database
    await departmentsValidation(departments, departmentsCache);
    // Validation - Check if positions exists in the database
    if (positions) {
        positionsValidation(positions, positionsCache)
    }

    let where: WhereOptions<IStatisticWhere> = {inst: departments};
    if (positions && positions.length > 0) {
        where = {...where, position: positions};
    }
  
    // TODO - Find a better way for typescript
    const queryRes: IStatisticsPerDepartment[] = await Dep.findAll<any>({
        attributes: [
            'inst',
            [Sequelize.fn('AVG', Sequelize.col('hindex')), 'avg_hindex'],
            [Sequelize.fn('SUM', Sequelize.col('publications')), 'sum_publications'],
            [Sequelize.fn('SUM', Sequelize.col('citations')), 'sum_citations'],
            [Sequelize.fn('AVG', Sequelize.col('hindex5')), 'avg_hindex5'],
            [Sequelize.fn('SUM', Sequelize.col('publications5')), 'sum_publications5'],
            [Sequelize.fn('SUM', Sequelize.col('citations5')), 'sum_citations5'],
            [Sequelize.fn('AVG', Sequelize.col('publications')), 'avg_publications_per_staff'],
            [Sequelize.fn('AVG', Sequelize.col('citations')), 'avg_citations_per_staff'],
        ],
        where,
        group: 'inst',
        raw: true,
    });

    for (const statistic of queryRes) {
        const sumYearsRange = (positions && positions.length > 0) ? (await activeYears(statistic.inst, positions)).length : (await activeYears(statistic.inst)).length;

        statistic.avg_hindex = Number(Math.round(parseFloat(statistic.avg_hindex + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
        statistic.avg_hindex5 = Number(Math.round(parseFloat(statistic.avg_hindex5 + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
        statistic.avg_publications_per_staff = Number(Math.round(parseFloat(statistic.avg_publications_per_staff + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
        statistic.avg_citations_per_staff = Number(Math.round(parseFloat(statistic.avg_citations_per_staff + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
        statistic.avg_publications_per_staff_per_year = Number(Math.round(parseFloat((statistic.avg_publications_per_staff / sumYearsRange) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
        statistic.avg_citations_per_staff_per_year = Number(Math.round(parseFloat((statistic.avg_citations_per_staff / sumYearsRange) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
    };

    res.json(sendResponse<IStatisticsPerDepartment[]>(200,'All good.', queryRes));
});

// Department's active years
export const getDepartmentsActiveYears = tryCatch(async (req: omeaCitationsReqBody<StatisticReq>, res: omeaCitationsRes<number[]>) => {
    const {position: positionsCache, departmentsID: departmentsCache} = req.cache;
    const {departments, positions}: StatisticReq = StatisticReqSchema.parse(req.body);
    
    // Validation - Check if departments exists in the database
    await departmentsValidation(departments, departmentsCache);
    // Validation - Check if positions exists in the database
    if (positions) {
        positionsValidation(positions, positionsCache)
    }

    const activeYearsData = await activeYears(departments, positions);
    

    res.json(sendResponse<number[]>(200,'All good.', activeYearsData));
});

// ACTIVE YEARS QUERY
const activeYears = async (departments: string | string[], positions?: string | string[], yearsRange?: number[]): Promise<number[]> => {
    const departmentArray = Array.isArray(departments) ? departments : [departments];
    const positionArray = Array.isArray(positions) ? positions : [positions];

    // Sequelize has very bad typescript support. It is better to let it as any.
    const where: WhereOptions<any> = {
        inst: {
          [Op.in]: departmentArray, // Use Op.in to filter by multiple department IDs
        },
      };
      if (positionArray && positionArray.length) {
        where.position = {
          [Op.in]: positionArray,
        };
      }
  
    // Retrieve the gsid values from the Dep table based on the departmentInst
    const departmentsGsid: Array<{ id: string }> = await Dep.findAll({
        where,
        attributes: ['id'], // Only retrieve the 'gsid' column
        raw: true, // Return raw data instead of Sequelize instances
      });
      
      
    // Extract the gsid values from the result and ensure uniqueness
    const gsidValues = Array.from(new Set(departmentsGsid.map((department) => department.id)));
    
    let unionQuery = `
      SELECT DISTINCT cyear FROM (
        SELECT cyear FROM publications WHERE gsid IN (:gsidValues)
        UNION
        SELECT cyear FROM citations WHERE gsid IN (:gsidValues)
      ) AS unioned_years
    `;

    const replacements: {gsidValues: string[], minYear?: number, maxYear?: number} = { gsidValues };

    if (yearsRange && yearsRange.length === 2) {
        unionQuery += ' WHERE cyear >= :minYear AND cyear <= :maxYear';
        replacements.minYear = yearsRange[0];
        replacements.maxYear = yearsRange[yearsRange.length - 1];
    } else {
        unionQuery += ' WHERE cyear >= 1';

    }

    const uniqueYears = gsidValues.length ? await sequelize.query(unionQuery, {
        replacements,
        type: QueryTypes.SELECT,
    }) : [];

    
    // Extract the unique year values from the result
    const years: number[] = uniqueYears.map((item: any) => item.cyear).sort();

    return years;
}

// Departments academic staff data
export const getDepartmentsAcademicStaffData = tryCatch(async (req: omeaCitationsReqBody<AcademicDataPaginationRequest>, res: omeaCitationsRes<IAcademicStaffData>) => {
    const {position: positionsCache, yearsRange: yearsCache, departmentsID: departmentsCache} = req.cache;
    const {departments, positions, years, page, size}: AcademicDataPaginationRequest = AcademicDataPaginationSchema.parse(req.body);
    
    // Validation - Check if departments exists in the database
    await departmentsValidation(departments, departmentsCache);
    // Validation - Check if years exists in the database
    await yearsValidation(years, yearsCache);
    // Validation - Check if positions exists in the database
    if (positions) {
        positionsValidation(positions, positionsCache)
    }

    const departmentArray = Array.isArray(departments) ? departments : [departments];

    // Sequelize has very bad typescript support. It is better to let it as any.
    const where: WhereOptions<any> = {
        inst: {
          [Op.in]: departmentArray, // Use Op.in to filter by multiple department IDs
        },
      };
      if (positions && positions.length) {
        where.position = {
          [Op.in]: positions,
        };
      }
      
    
      // Use the gsid values to retrieve all columns from the Dep table
      const academicData = await Dep.findAndCountAll({
        where,
        raw: true,
        limit: size,
        offset: page * size,
      });

    //   console.log('EDDDDDDDDDDDDDDDDDDDDDDDDDDDW',academicData);
      

    // Extract the position IDs from the academicData result
    const positionIds = academicData.rows.map((data) => data.id);
    // console.log('EDDDDDDDDDDDDDDDDDDDDDDDDDDDW',positionIds);

    // Get the active years array
    const activeYearsData = await activeYears(departments, positions);

    // Get the range of active years base of user's input
    const yearsInRange = activeYearsData.filter((year) => year >= years[0] && year <= years[years.length - 1]);

      // Fetch the publication and citation data for the specified years and group them by year for each position ID
    const publicationData = await Publications.findAll({
        where: {
            id: {
                [Op.in]: positionIds,
            },
            year: {
                [Op.in]: yearsInRange,
            },
        },
        attributes: ['id', 'year', 'counter'],
        raw: true,
    });

    const citationData = await Citations.findAll({
        where: {
            id: {
                [Op.in]: positionIds,
            },
            year: {
                [Op.in]: yearsInRange,
            },
        },
        attributes: ['id', 'year', 'counter'],
        raw: true,
    });

    // console.log(publicationData);

    
  // Group the publication and citation data by year for each position ID
  const groupedPublicationData: GroupedData = publicationData.reduce((acc, data) => {
    const positionId = data.id;
    if (!acc[positionId]) {
      acc[positionId] = { total: 0, data: [] };
    }
    acc[positionId].data.push({ year: data.year, count: data.counter });
    acc[positionId].total += data.counter;
    return acc;
  }, {} as GroupedData);

  const groupedCitationData: GroupedData = citationData.reduce((acc, data) => {
    const positionId = data.id;
    if (!acc[positionId]) {
      acc[positionId] = { total: 0, data: [] };
    }
    acc[positionId].data.push({ year: data.year, count: data.counter });
    acc[positionId].total += data.counter;
    return acc;
  }, {} as GroupedData);

  // Combine the academicData with the grouped publication and citation data
  const academicDataWithStats: AcademicData[] = academicData.rows.map((data) => {
    const positionId = data.id;

    // Extract unique years from citations and publications
    const uniqueYearsSet = new Set<number>();

    groupedCitationData[positionId]?.data.forEach((citation) => uniqueYearsSet.add(citation.year));
    groupedPublicationData[positionId]?.data.forEach((publication) => uniqueYearsSet.add(publication.year));

    // Get the length of the Set
    const uniqueYearsCount = uniqueYearsSet.size;

    return {
      ...data,
      publications: groupedPublicationData[positionId]?.data || [],
      publicationTotal: groupedPublicationData[positionId]?.total || 0,
      citations: groupedCitationData[positionId]?.data || [],
      citationTotal: groupedCitationData[positionId]?.total || 0,
      averagePublication: Number(Math.round(parseFloat((groupedPublicationData[positionId]?.total / uniqueYearsCount) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces) || 0,
      averageCitation: Number(Math.round(parseFloat((groupedCitationData[positionId]?.total / uniqueYearsCount) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces) || 0,
    };
  });

    res.json(sendResponse<IAcademicStaffData>(200,'All good.', {academic_data: academicDataWithStats, years_range: yearsInRange, count: academicData.count}));
});

const roundNumberWithDecimalPlaces = (num: number, numOfDecimals: string = decimalPlaces): number => {
    return +(Math.round(+(num + 'e+' + numOfDecimals))  + 'e-' + numOfDecimals) || 0;
}

export const getDepartmentsAnalyticsData = tryCatch(async (req: omeaCitationsReqBody<DepartmentsAnalyticsReq>, res: omeaCitationsRes<any>) => {
    const {position: positionsCache, yearsRange: yearsCache, departmentsID: departmentsCache, departmentsStaticStats: depStatsCache} = req.cache;
    const {positions, years}: DepartmentsAnalyticsReq = DepartmentsAnalyticsReqSchema.parse(req.body);
    
    // Validation - Check if years exists in the database
    await yearsValidation(years, yearsCache);
    // Validation - Check if positions exists in the database
    if (positions) {
        positionsValidation(positions, positionsCache)
    }

    const departmentArray = departmentsCache.map((dep) => dep.id);

    const positionArray = Array.isArray(positions) ? positions : [positions];


    // Sequelize has very bad typescript support. It is better to let it as any.
    const where: WhereOptions<any> = {
        inst: {
          [Op.in]: departmentArray, // Use Op.in to filter by multiple department IDs
        },
    };
    if (positionArray && positionArray.length) {
        where.position = {
            [Op.in]: positionArray,
        };
    }
    // console.log('where HERE',where)
    
    // Use the gsid values to retrieve all columns from the Dep table
    const academicData = await Dep.findAll({
        where,
        raw: true,
        attributes: ['inst', 'id', 'position']
    });

    const groupedData: {[inst: string]: string[]} = {};

    academicData.forEach((item) => {
        if (!groupedData[item.inst]) {
            groupedData[item.inst] = [];
        }

        groupedData[item.inst].push(item.id);
    });

    // console.log('groupedData', groupedData);
    
    const eachDepActiveYears: any[] = [];
    
    if (!depStatsCache || !depStatsCache.length) {
        const positionsArray = positionsCache.map((position) => position.position);
        // console.log(positionsArray);
        const yearsArray = [yearsCache[0].year, yearsCache[yearsCache.length - 1].year]
        // console.log(yearsArray);
        
        await createDepartmentsAnalysis(departmentArray, positionsArray, yearsArray);
    }
    // console.log(reqCache.departmentsStaticStats);
    const depsDynamicStats = await createDepartmentsAnalysis(departmentArray, positionArray, years, where);
    if (depsDynamicStats && reqCache?.departmentsStaticStats?.length) {
        // console.log(depsDynamicStats);

        const combinedObjects = {};

        departmentArray.forEach((inst) => {
            // Find the objects with the same inst ID in both arrays
            const dynamicData = depsDynamicStats?.find(obj => obj.inst === inst);
            const staticData = reqCache?.departmentsStaticStats?.find(obj => obj.inst === inst);

            if (dynamicData && staticData) {
                // Combine the objects
                const departmentStats = {
                totalCitations: dynamicData.totalCitations,
                totalPublications: dynamicData.totalPublications,
                staffCount: staticData.staffCount,
                avgPublicationsPerStaff: staticData.avgPublicationsPerStaff,
                avgCitationsPerStaff: staticData.avgCitationsPerStaff,
                maxPublicationsCount: dynamicData.maxPublicationsCount,
                minPublicationsCount: dynamicData.minPublicationsCount,
                maxCitationsCount: dynamicData.maxCitationsCount,
                minCitationsCount: dynamicData.minCitationsCount,
                cvPublications: staticData.cvPublications,
                cvCitations: staticData.cvCitations,
                avgHIndex: staticData.avgHIndex,
                minHIndex: staticData.minHIndex,
                maxHIndex: staticData.maxHIndex
                };
                eachDepActiveYears.push({[inst]: departmentStats})
            }
        });

        // console.log(combinedObjects);

    }

    res.json(sendResponse<any>(200,'All good.', eachDepActiveYears));
});

export const createDepartmentsAnalysis = async (departments: string[], positions: string[], yearsRange: number[], where: WhereOptions<any> = {}): Promise<void | DepartmentsDynamicStatsIDs[]> => {
    // Empty where means that it will create the Static data for departments and they will be cached
    const isDynamicData = !!Object.keys(where).length;

    const academicData = await Dep.findAll({
        where,
        raw: true,
        attributes: ['inst', 'id', 'position']
    });

    // console.log(academicData);
    
    const groupedData: {[inst: string]: string[]} = {};

    academicData.forEach((item) => {
        if (!groupedData[item.inst]) {
            groupedData[item.inst] = [];
        }

        groupedData[item.inst].push(item.id);
    });

    const departmentsStaticStats: DepartmentsStaticStatsCache[] = [];

    const departmentsDynamicStats: DepartmentsDynamicStatsIDs[] = [];


    for (const dep of departments) {
        // Get the active years array
        const activeYearsData = await activeYears(dep, positions, yearsRange);
        // console.log(activeYearsData);
        

        const currentDepStaffsIDs = groupedData[dep];

        
        // Fetch the publication and citation data for the specified years and group them by year for each position ID
        if (currentDepStaffsIDs && activeYearsData && currentDepStaffsIDs.length && activeYearsData.length) {
            const publicationData = await Publications.findAll({
                where: {
                    id: {
                        [Op.in]: currentDepStaffsIDs,
                    },
                    year: {
                        [Op.in]: activeYearsData,
                    },
                },
                attributes: ['id', 'year', 'counter'],
                raw: true,
            });

            const publicationsTotalPerStaff: any = {};
            publicationData.forEach(item => {
                if (!publicationsTotalPerStaff[item.id]) {
                  publicationsTotalPerStaff[item.id] = 0;
                }
                publicationsTotalPerStaff[item.id] += item.counter;
            });

            let maxPublicationsStaff;
            let minPublicationsStaff;
            let maxPublicationsCount = -Infinity;
            let minPublicationsCount = Infinity;
            if (isDynamicData) {
                for (const id in publicationsTotalPerStaff) {
                    if (publicationsTotalPerStaff[id] > maxPublicationsCount) {
                        maxPublicationsCount = publicationsTotalPerStaff[id];
                        maxPublicationsStaff = id;
                    }
                    if (publicationsTotalPerStaff[id] < minPublicationsCount) {
                        minPublicationsCount = publicationsTotalPerStaff[id];
                        minPublicationsStaff = id;
                    }
                }
            }    
        
            const citationData = await Citations.findAll({
                where: {
                    id: {
                        [Op.in]: currentDepStaffsIDs,
                    },
                    year: {
                        [Op.in]: activeYearsData,
                    },
                },
                attributes: ['id', 'year', 'counter'],
                raw: true,
            });

            const citationsTotalPerStaff: any = {};
            citationData.forEach(item => {
                if (!citationsTotalPerStaff[item.id]) {
                  citationsTotalPerStaff[item.id] = 0;
                }
                citationsTotalPerStaff[item.id] += item.counter;
            });

            let maxCitationsStaff;
            let minCitationsStaff;
            let maxCitationsCount = -Infinity;
            let minCitationsCount = Infinity;
            if (isDynamicData) {
                for (const id in citationsTotalPerStaff) {
                    if (citationsTotalPerStaff[id] > maxCitationsCount) {
                        maxCitationsCount = citationsTotalPerStaff[id];
                        maxCitationsStaff = id;
                    }
                    if (citationsTotalPerStaff[id] < minCitationsCount) {
                        minCitationsCount = citationsTotalPerStaff[id];
                        minCitationsStaff = id;
                    }
                }
            }
            
        
            // // console.log(publicationData);
          
            // Calculate the sum of citations and publications
            const totalCitations = citationData.reduce((acc, item) => acc + item.counter, 0);
            const totalPublications = publicationData.reduce((acc, item) => acc + item.counter, 0);
            if (!isDynamicData) {
                // Count the number of staff
                const staffCount = currentDepStaffsIDs.length;
              
                // Calculate the average publications per year and citations per year
                //                              totalPublications
                const avgPublicationsPerStaff = totalPublications / staffCount;
                //                           totalPublications
                const avgCitationsPerStaff = totalCitations / staffCount;
    
                // Calculate the CV for publications
                // Calculate squared differences and sum them
                //                                                           publicationsTotalPerStaff
                const publicationsSquaredDifferencesSum: any = Object.values(publicationsTotalPerStaff).reduce((sum: any, publications: any) => {
                    const difference = publications - avgPublicationsPerStaff;
                    return sum + difference * difference;
                }, 0);
                
                // Calculate the variance
                const publicationsVariance = publicationsSquaredDifferencesSum / staffCount;
                
                // Calculate the standard deviation
                const publicationsStandardDeviation = Math.sqrt(publicationsVariance);
                const cvPublications = (publicationsStandardDeviation / avgPublicationsPerStaff) * 100;
    
                // Calculate the CV for citations
                // Calculate squared differences and sum them
                //                                                        citationsTotalPerStaff
                const citationsSquaredDifferencesSum: any = Object.values(citationsTotalPerStaff).reduce((sum: any, citations: any) => {
                    const difference = citations - avgCitationsPerStaff;
                    return sum + difference * difference;
                }, 0);
                
                // Calculate the variance
                const citationsVariance = citationsSquaredDifferencesSum / staffCount;
                
                // Calculate the standard deviation
                const citationsStandardDeviation = Math.sqrt(citationsVariance);
    
                const cvCitations = (citationsStandardDeviation / avgCitationsPerStaff) * 100;
    
    
    
                //CALCULATE H INDEX
                const dataByResearchers: ResearcherData = {};
    
                //citationData 
                citationData.forEach(citation => {
                  const { id, year, counter } = citation;
                  if (!dataByResearchers[id]) {
                    dataByResearchers[id] = [];
                  }
                  dataByResearchers[id].push({ year, counter });
                });
                
                const departmentHIndices: number[] = [];
                
                for (const id in dataByResearchers) {
                  const researcherCitations = dataByResearchers[id];
                  const hIndex = calculateHIndex(researcherCitations);
                  departmentHIndices.push(hIndex);
                }
                
                const totalHIndex = departmentHIndices.reduce((sum, hIndex) => sum + hIndex, 0);
                const avgHIndex = totalHIndex / staffCount;
                
                // console.log(`Average H-index for the department: ${avgHIndex}`);
    
                // Calculate the minimum and maximum H-indices for the department
                const minHIndex = Math.min(...departmentHIndices);
                const maxHIndex = Math.max(...departmentHIndices);
    
                // Create an object to store the aggregated data
                const depStaticStats: DepartmentsStaticStatsCache = {
                  staffCount,
                  avgPublicationsPerStaff: roundNumberWithDecimalPlaces(avgPublicationsPerStaff, '1'),
                  avgCitationsPerStaff: roundNumberWithDecimalPlaces(avgCitationsPerStaff, '1'),
                  cvPublications: roundNumberWithDecimalPlaces(cvPublications, '1'),
                  cvCitations: roundNumberWithDecimalPlaces(cvCitations, '1'),
                  avgHIndex: roundNumberWithDecimalPlaces(avgHIndex),
                  minHIndex,
                  maxHIndex,
                  inst: dep
                };
        
                departmentsStaticStats.push(depStaticStats)
            } else {
                const depDynamicStats: DepartmentsDynamicStatsIDs = {
                    totalCitations,
                    totalPublications,
                    maxPublicationsCount,
                    minPublicationsCount,
                    maxCitationsCount,
                    minCitationsCount,
                    inst: dep
                }
                departmentsDynamicStats.push(depDynamicStats);
            }
            
        }
    };
    if (!isDynamicData) {
        cache.put(cacheKeysEnum.DepartmentsStaticStats, departmentsStaticStats, cacheTime);
        reqCache.departmentsStaticStats = departmentsStaticStats;
        return;
    } else {
        return departmentsDynamicStats;
    }
}

export const getAcademicPositionTotals = tryCatch(async (req: omeaCitationsReqQuery<AcademicPositionTotalsRequest>, res: omeaCitationsRes<IAcademicPositionTotals[]>) => {
    const {position: positionsCache, yearsRange: yearsCache, departmentsID: departmentsCache} = req.cache;
    const {departments: departmentsZod, positions: positionsZod, years: yearsString}: AcademicPositionTotalsRequest = AcademicPositionTotalsSchema.parse(req.query);
    const departments = departmentsZod.split(',');
    const positions = positionsZod.split(',');

    const years = yearsString.split(',').map((item) => parseInt(item, 10));

    // Validation - Check if years exists in the database
    await yearsValidation(years, yearsCache);
    // Validation - Check if departments exists in the database
    await departmentsValidation(departments, departmentsCache);
    // Validation - Check if positions exists in the database
    await positionsValidation(positions, positionsCache)

    const departmentArray = Array.isArray(departments) ? departments : [departments];

    const positionArray = Array.isArray(positions) ? positions : [positions];

    // Sequelize has very bad typescript support. It is better to let it as any.
    const where: WhereOptions<any> = {
        inst: {
            [Op.in]: departmentArray, // Use Op.in to filter by multiple department IDs
        },
    };
    if (positionArray && positionArray.length) {
        where.position = {
            [Op.in]: positionArray,
        };
    }

    const academicData = await Dep.findAll({
        where,
        raw: true,
        attributes: ['inst', 'id', 'position'],
    });

    const staffPerPositionPerDep: IStaffPerPositionPerDep[] = [];

    // Loop through the initial data
    for (const item of academicData) {
        let existingInstIndex = -1;
      
        // Find the index of the 'inst' in staffPerPositionPerDep
        for (let i = 0; i < staffPerPositionPerDep.length; i++) {
            if (staffPerPositionPerDep[i].inst === item.inst) {
            existingInstIndex = i;
            break;
            }
        }
      
        // If 'inst' doesn't exist in staffPerPositionPerDep, create it
        if (existingInstIndex === -1) {
            staffPerPositionPerDep.push({
            inst: item.inst,
            staffPerPosition: [{
                position: item.position,
                ids: [item.id],
            }],
            });
        } else {
            // If 'inst' exists, find the index of the 'position' in staffPerPosition
            const existingPositionIndex = staffPerPositionPerDep[existingInstIndex].staffPerPosition.findIndex(
                (pos) => pos.position === item.position
            );
        
            // If 'position' doesn't exist in staffPerPosition, create it
            if (existingPositionIndex === -1) {
                staffPerPositionPerDep[existingInstIndex].staffPerPosition.push({
                    position: item.position,
                    ids: [item.id],
                });
            } else {
                // If 'position' exists, push the item.id to the existing 'id' array
                staffPerPositionPerDep[existingInstIndex].staffPerPosition[existingPositionIndex].ids.push(item.id);
            }
        }
    }
    
    const groupedData: {[inst: string]: string[]} = {};

    academicData.forEach((item) => {
        if (!groupedData[item.inst]) {
            groupedData[item.inst] = [];
        }

        groupedData[item.inst].push(item.id);
    });

    const dataPerDep: IResearchDataPerDep[] = [];
    for (const dep of departmentArray) {
        // Get the active years array
        const activeYearsData = await activeYears(dep, positions, years);

        const currentDepStaffsIDs = groupedData[dep];

        
        // Fetch the publication and citation data for the specified years and group them by year for each position ID
        if (currentDepStaffsIDs && activeYearsData && currentDepStaffsIDs.length && activeYearsData.length) {
            const publicationData = await Publications.findAll({
                where: {
                    id: {
                        [Op.in]: currentDepStaffsIDs,
                    },
                    year: {
                        [Op.in]: activeYearsData,
                    },
                },
                attributes: ['id', 'year', 'counter'],
                raw: true,
            });

            const publicationsTotalPerStaff: any = {};
            publicationData.forEach(item => {
                if (!publicationsTotalPerStaff[item.id]) {
                  publicationsTotalPerStaff[item.id] = 0;
                }
                publicationsTotalPerStaff[item.id] += item.counter;
            });

            const publicationsPerStaff: IStaffResearch[] = []
            for (const [key, value] of Object.entries(publicationsTotalPerStaff)) {
                publicationsPerStaff.push({
                    id: key,
                    total: value as number,
                });
            }
               
            const citationData = await Citations.findAll({
                where: {
                    id: {
                        [Op.in]: currentDepStaffsIDs,
                    },
                    year: {
                        [Op.in]: activeYearsData,
                    },
                },
                attributes: ['id', 'year', 'counter'],
                raw: true,
            });

            const citationsTotalPerStaff: any = {};
            citationData.forEach(item => {
                if (!citationsTotalPerStaff[item.id]) {
                  citationsTotalPerStaff[item.id] = 0;
                }
                citationsTotalPerStaff[item.id] += item.counter;
            });

            const citationsPerStaff: IStaffResearch[] = []
            for (const [key, value] of Object.entries(citationsTotalPerStaff)) {
                citationsPerStaff.push({
                    id: key,
                    total: value as number,
                });
            }   
          
            // Calculate the sum of citations and publications
            const totalCitations = citationData.reduce((acc, item) => acc + item.counter, 0);
            const totalPublications = publicationData.reduce((acc, item) => acc + item.counter, 0);

            // Create an object to store the aggregated data
            const departmentStats = {
              totalCitations,
              totalPublications,
              publicationsTotalPerStaff: publicationsPerStaff,
              citationsTotalPerStaff: citationsPerStaff,
            };
    
            dataPerDep.push({inst: dep, departmentStats: departmentStats})
            
        } else {
            dataPerDep.push({inst: dep, departmentStats: {
                publicationsTotalPerStaff: [],
                citationsTotalPerStaff: [],
                totalCitations: 0,
                totalPublications: 0,
            }})
        }
        
    };

    return res.json(sendResponse<IAcademicPositionTotals[]>(200,'All good.', groupAndSumData(staffPerPositionPerDep, dataPerDep, positionArray)));
});


export const groupAndSumData = (
    staffPerPositionPerDep: IStaffPerPositionPerDep[],
    dataPerDep: IResearchDataPerDep[],
    positionArray: Array<string>,
  ): IAcademicPositionTotals[] => {
    const groupByInst = new Map<string, IStaffPerPosition[]>();
    for (const item of staffPerPositionPerDep) {
        const inst = item.inst;
        const staffPerPosition = item.staffPerPosition;

        if (!groupByInst.has(inst)) {
            groupByInst.set(inst, staffPerPosition);
        }
    }
    
    const groupedData: IAcademicPositionTotals[] = [];
    
    for (const [inst, positionsArray] of groupByInst) {
        const researchPerPositions = positionArray.map((position) => {
            return {
                position,
                citations: 0,
                publications: 0,
            }
        });
        
        for (const staffPerPosition of positionsArray) {
            const position = staffPerPosition.position;
            const staffArray = staffPerPosition.ids;
            
            const positionIndex = researchPerPositions.findIndex((researchPerPosition) => {
                return researchPerPosition.position === position
            });
            
            const researchValues = dataPerDep.find((entry) => entry.inst === inst);
            if (researchValues) {
                researchValues.departmentStats.citationsTotalPerStaff.forEach((staffResearch) => {
                    if (staffArray.some((id) => id === staffResearch.id)) {
                        researchPerPositions[positionIndex].citations += staffResearch.total;
                    }
                });

                researchValues.departmentStats.publicationsTotalPerStaff.forEach((staffResearch) => {
                    if (staffArray.some((id) => id === staffResearch.id)) {
                        researchPerPositions[positionIndex].publications += staffResearch.total;
                    }
                });
            }
        }
    
        groupedData.push({ inst, researchPerPosition: researchPerPositions });
    }
    return groupedData;
}

export const getScholarlyProfiles = tryCatch(async (req: omeaCitationsReqQuery<AcademicPositionTotalsRequest>, res: omeaCitationsRes<IScholarlyProfilesPerDep[]>) => {
    const {position: positionsCache, yearsRange: yearsCache, departmentsID: departmentsCache} = req.cache;
    const {departments: departmentsZod, positions: positionsZod, years: yearsString}: AcademicPositionTotalsRequest = AcademicPositionTotalsSchema.parse(req.query);
    const departments = departmentsZod.split(',');
    const positions = positionsZod.split(',');
    const years = yearsString.split(',').map((item) => parseInt(item, 10));

    // Validation - Check if years exists in the database
    await yearsValidation(years, yearsCache);
    // Validation - Check if departments exists in the database
    await departmentsValidation(departments, departmentsCache);
    // Validation - Check if positions exists in the database
    await positionsValidation(positions, positionsCache)

    const departmentArray = Array.isArray(departments) ? departments : [departments];

    const positionArray = Array.isArray(positions) ? positions : [positions];

    // Sequelize has very bad typescript support. It is better to let it as any.
    const where: WhereOptions<any> = {
        inst: {
            [Op.in]: departmentArray, // Use Op.in to filter by multiple department IDs
        },
    };
    if (positionArray && positionArray.length) {
        where.position = {
            [Op.in]: positionArray,
        };
    }

    const academicData = await Dep.findAll({
        where,
        raw: true,
        attributes: ['inst', 'id', 'position', 'name'],
    });
    
    const groupedData: {[inst: string]: Map<string, string>} = {};

    academicData.forEach((item) => {
        if (!groupedData[item.inst]) {
            groupedData[item.inst] = new Map();
        }
        groupedData[item.inst].set(item.id, item.name);
    });

    const dataPerDep: IScholarlyProfilesPerDep[] = [];
    for (const dep of departmentArray) {
        // Get the active years array
        const activeYearsData = await activeYears(dep, positions, years);

        const currentDepStaffsIDs = Array.from(groupedData[dep].keys());

        
        // Fetch the publication and citation data for the specified years and group them by year for each position ID
        if (currentDepStaffsIDs && activeYearsData && currentDepStaffsIDs.length && activeYearsData.length) {
            const publicationData = await Publications.findAll({
                where: {
                    id: {
                        [Op.in]: currentDepStaffsIDs,
                    },
                    year: {
                        [Op.in]: activeYearsData,
                    },
                },
                attributes: ['id', 'year', 'counter'],
                raw: true,
            });

            const publicationsTotalPerStaff: any = {};
            publicationData.forEach(item => {
                if (!publicationsTotalPerStaff[item.id]) {
                  publicationsTotalPerStaff[item.id] = 0;
                }
                publicationsTotalPerStaff[item.id] += item.counter;
            });

            const publicationsPerStaff: IStaffNamesResearch[] = []
            for (const [key, value] of Object.entries(publicationsTotalPerStaff)) {
                publicationsPerStaff.push({
                    id: key,
                    total: value as number,
                    name: groupedData[dep]?.get(key)!
                });
            }
               
            const citationData = await Citations.findAll({
                where: {
                    id: {
                        [Op.in]: currentDepStaffsIDs,
                    },
                    year: {
                        [Op.in]: activeYearsData,
                    },
                },
                attributes: ['id', 'year', 'counter'],
                raw: true,
            });

            const citationsTotalPerStaff: any = {};
            citationData.forEach(item => {
                if (!citationsTotalPerStaff[item.id]) {
                  citationsTotalPerStaff[item.id] = 0;
                }
                citationsTotalPerStaff[item.id] += item.counter;
            });

            const citationsPerStaff: IStaffNamesResearch[] = []
            for (const [key, value] of Object.entries(citationsTotalPerStaff)) {
                citationsPerStaff.push({
                    id: key,
                    total: value as number,
                    name: groupedData[dep]?.get(key)!
                });
            }   
          
            // Calculate the sum of citations and publications
            const totalCitations = citationData.reduce((acc, item) => acc + item.counter, 0);
            const totalPublications = publicationData.reduce((acc, item) => acc + item.counter, 0);

            // Create an object to store the aggregated data
            const departmentStats = {
              totalCitations,
              totalPublications,
              publicationsTotalPerStaff: publicationsPerStaff,
              citationsTotalPerStaff: citationsPerStaff,
            };
    
            dataPerDep.push({inst: dep, departmentStats: departmentStats})
            
        } else {
            dataPerDep.push({inst: dep, departmentStats: {
                publicationsTotalPerStaff: [],
                citationsTotalPerStaff: [],
                totalCitations: 0,
                totalPublications: 0,
            }})
        }
        
    };

    return res.json(sendResponse<IScholarlyProfilesPerDep[]>(200,'All good.', dataPerDep));
});

// academicStaffResearchSummary
export const getAcademicStaffResearchSummary = tryCatch(async (req: omeaCitationsReqQuery<AcademicPositionTotalsRequest>, res: omeaCitationsRes<IAcademicStaffResearchSummary[]>) => {
    const {position: positionsCache, yearsRange: yearsCache, departmentsID: departmentsCache} = req.cache;
    const {departments: departmentsZod, positions: positionsZod, years: yearsString}: AcademicPositionTotalsRequest = AcademicPositionTotalsSchema.parse(req.query);
    const departments = departmentsZod.split(',');
    const positions = positionsZod.split(',');
    const years = yearsString.split(',').map((item) => parseInt(item, 10));

    // Validation - Check if years exists in the database
    await yearsValidation(years, yearsCache);
    // Validation - Check if departments exists in the database
    await departmentsValidation(departments, departmentsCache);
    // Validation - Check if positions exists in the database
    await positionsValidation(positions, positionsCache)

    const departmentArray = Array.isArray(departments) ? departments : [departments];

    const positionArray = Array.isArray(positions) ? positions : [positions];

    // Sequelize has very bad typescript support. It is better to let it as any.
    const where: WhereOptions<any> = {
        inst: {
            [Op.in]: departmentArray, // Use Op.in to filter by multiple department IDs
        },
        position: {
            [Op.in]: positionArray, // Use Op.in to filter by multiple department IDs
        },
    };

    // Use the gsid values to retrieve all columns from the Dep table
    const academicData = await Dep.findAll({
        where,
        raw: true,
        attributes: ['inst', 'id', 'position', 'name']
    });

    // console.log(academicData);
    

    const groupedData: {[inst: string]: string[]} = {};

    academicData.forEach((item) => {
        if (!groupedData[item.inst]) {
            groupedData[item.inst] = [];
        }

        groupedData[item.inst].push(item.id);
    });

    // console.log('groupedData', groupedData);
    
    const academicStaffResearchSummary: IAcademicStaffResearchSummary[] = [];
    for (const dep of departmentArray) {
        // Get the active years array
        const activeYearsData = await activeYears(dep, positions, years);

        const currentDepStaffsIDs = groupedData[dep];

        
        // Fetch the publication and citation data for the specified years and group them by year for each position ID
        if (currentDepStaffsIDs && activeYearsData && currentDepStaffsIDs.length && activeYearsData.length) {
            const publicationData = await Publications.findAll({
                where: {
                    id: {
                        [Op.in]: currentDepStaffsIDs,
                    },
                    year: {
                        [Op.in]: activeYearsData,
                    },
                },
                attributes: ['id', 'year', 'counter'],
                raw: true,
            });

            const publicationsTotalPerStaff: any = {};
            publicationData.forEach(item => {
                if (!publicationsTotalPerStaff[item.id]) {
                  publicationsTotalPerStaff[item.id] = 0;
                }
                publicationsTotalPerStaff[item.id] += item.counter;
            });
        
            const citationData = await Citations.findAll({
                where: {
                    id: {
                        [Op.in]: currentDepStaffsIDs,
                    },
                    year: {
                        [Op.in]: activeYearsData,
                    },
                },
                attributes: ['id', 'year', 'counter'],
                raw: true,
            });

            const citationsTotalPerStaff: any = {};
            citationData.forEach(item => {
                if (!citationsTotalPerStaff[item.id]) {
                  citationsTotalPerStaff[item.id] = 0;
                }
                citationsTotalPerStaff[item.id] += item.counter;
            });
          
            const result: StaffResearchSummary[] = [];

            for (const key in publicationsTotalPerStaff) {
              if (citationsTotalPerStaff.hasOwnProperty(key)) {
                const matchingName = academicData.find((depStaff) => depStaff.id.trim() === key.trim());
                if (!matchingName) {

                }
                result.push({
                  id: key,
                  name: matchingName?.name || '',
                  publications: publicationsTotalPerStaff[key],
                  citations: citationsTotalPerStaff[key],
                });
              }
            }
    
            academicStaffResearchSummary.push({
                inst: dep,
                research: result,
            })
            
        }
        
    }; 

    return res.json(sendResponse<IAcademicStaffResearchSummary[]>(200,'All good.', academicStaffResearchSummary));
});

const calculateHIndex = (citations: StaffDataPerYear[]): number => {
    citations.sort((a, b) => b.counter - a.counter);
    let hIndex = 0;
    for (let i = 0; i < citations.length; i++) {
      if (citations[i].counter >= i + 1) {
        hIndex++;
      } else {
        break;
      }
    }
    return hIndex;
}

export interface StaffDataPerYear {
    year: number;
    counter: number;
}

export interface ResearcherData {
    [id: string]: StaffDataPerYear[];
}

export interface IStatisticWhere {
    inst: string | string[],
    position?: string | string[],
}

export interface GroupedData {
    [positionId: string]: {
      total: number;
      data: { year: number; count: number }[];
    };
}

// getAcademicPositionTotals Interfaces

export interface IStaffPerPosition {
    position: string;
    ids: string[];
}

export interface IStaffPerPositionPerDep {
    inst: string;
    staffPerPosition: IStaffPerPosition[];
}

export interface IStaffResearch {
    id: string;
    total: number;
}

export interface IDepResearchStats<T> {
    totalCitations: number;
    totalPublications: number;
    publicationsTotalPerStaff: T[];
    citationsTotalPerStaff: T[];

}

export interface IResearchDataPerDep {
    inst: string;
    departmentStats: IDepResearchStats<IStaffResearch>;
}

// -------------------------------------

// getScholarlyProfiles interfaces

export interface IStaffNamesResearch extends IStaffResearch {
    name: string;
}

export interface IScholarlyProfilesPerDep {
    inst: string;
    departmentStats: IDepResearchStats<IStaffNamesResearch>;
}

// -------------------------------------