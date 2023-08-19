import { Request } from 'express';
import { Model, Op, QueryTypes, Sequelize, WhereOptions } from 'sequelize';
import { sendResponse } from '../api/common';
import Departments from '../models/department.model';
import { departmentsModel, omeaCitationsRes, omeaCitationsReqQuery, omeaCitationsReqBody, IDepartments, IDep, IPublications } from '../types';
import { checkFilter } from '../utils/checkFilter';
import { tryCatch } from '../utils/tryCatch';
import { StatisticReq, StatisticReqSchema, Filter, FilterSchema, DepartmentsReq, DepartmentsReqSchema, DepartmentReq, DepartmentSchema, AcademicDataRequest, AcademicDataSchema } from '../types/request.types';
import Dep from '../models/dep.model';
import sequelize from '../db/connection';
import Publications from '../models/publication.model';
import Citations from '../models/citation.model';

const decimalPlaces = '2';

// I can put type on getDepartments if i return the res.json but is useless because express and my custom types already checks what i am going to return
export const getDepartments = tryCatch(async (req: omeaCitationsReqBody<Filter>, res: omeaCitationsRes<IDepartments[]>) => {
    const {filter}: Filter = FilterSchema.parse(req.body);


    // CheckFilter does not need anymore because i am handling the error from zod!
    // checkFilter(req.body, filter);

    if (filter === 'id') {
        return res.json(sendResponse<IDepartments[]>(200, 'All good.', req.cache.departmentsID));
    }
    const deparmentsList = await getDepartmentsData(filter);
    
    return res.json(sendResponse<IDepartments[]>(200, 'All good.', deparmentsList));
});

export const getDepartment = tryCatch(async (req: omeaCitationsReqQuery<{id:string}, {test: string, test2: string}>, res: omeaCitationsRes<IDepartments>) => {
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


// export const getDepartmentsStaff = tryCatch(async (req: omeaCitationsReqBody<DepartmentsReq>, res: omeaCitationsRes<IDepartments[]>) => {
//     const {departments}: DepartmentsReq = DepartmentsSchema.parse(req.body);
//     console.log(departments);

//     // if (departments) {
//     //     const deparmentsList = await Departments.findAll({
//     //         attributes: [
//     //             [Sequelize.fn('DISTINCT', Sequelize.col(filter)), filter]
//     //         ]
//     //     });
//     //     return res.json(sendResponse<departmentsModel[]>(200, 'All good.', deparmentsList));
//     // }
    
//     // const deparmentsList = await Departments.findAll();
//     // res.json(sendResponse<departmentsModel[]>(200, 'All good.', deparmentsList));
// });


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
  
export const getStatisticsPerDepartments = tryCatch(async (req: omeaCitationsReqBody<StatisticReq>, res: omeaCitationsRes<IStatustucsPerDepartment[]>) => {
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
    const queryRes: IStatustucsPerDepartment[] = await Dep.findAll<any>({
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

    res.json(sendResponse<IStatustucsPerDepartment[]>(200,'All good.', queryRes));
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
const activeYears = async (departments: string | string[], positions?: string | string[]): Promise<number[]> => {
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
  
    // Retrieve the gsid values from the Dep table based on the departmentInst
    const departmentsGsid: Array<{ id: string }> = await Dep.findAll({
        where,
        attributes: ['id'], // Only retrieve the 'gsid' column
        raw: true, // Return raw data instead of Sequelize instances
      });
      
      
    // Extract the gsid values from the result and ensure uniqueness
    const gsidValues = Array.from(new Set(departmentsGsid.map((department) => department.id)));
    
    const unionQuery = `
      SELECT DISTINCT cyear FROM (
        SELECT cyear FROM publications WHERE gsid IN (:gsidValues)
        UNION
        SELECT cyear FROM citations WHERE gsid IN (:gsidValues)
      ) AS unioned_years
      WHERE cyear >= 1
    `;

    const replacements = { gsidValues }; // Replace this with your actual gsidValues array


    const uniqueYears = gsidValues.length ? await sequelize.query(unionQuery, {
        replacements,
        type: QueryTypes.SELECT,
    }) : [];

    
    // Extract the unique year values from the result
    const years: number[] = uniqueYears.map((item: any) => item.cyear).sort();

    return years;
}

// Departments academic staff data
export const getDepartmentsAcademicStaffData = tryCatch(async (req: omeaCitationsReqBody<AcademicDataRequest>, res: omeaCitationsRes<IAcademicStaffData>) => {
    const {position: positionsCache, yearsRange: yearsCache, departmentsID: departmentsCache} = req.cache;
    const {departments, positions, years}: AcademicDataRequest = AcademicDataSchema.parse(req.body);
    
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
      const academicData = await Dep.findAll({
        where,
        raw: true,
      });

    // Extract the position IDs from the academicData result
    const positionIds = academicData.map((data) => data.id);

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

    console.log(publicationData);

    
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
  const academicDataWithStats: AcademicData[] = academicData.map((data) => {
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

    res.json(sendResponse<IAcademicStaffData>(200,'All good.', {academic_data: academicDataWithStats, years_range: yearsInRange}));
});

// Validators
const departmentsValidation = async (departments: string[] | string, cacheDepartments: {id: string}[]): Promise<void> => {
    const targetDepartments = Array.isArray(departments) ? departments : [departments];
    if (!targetDepartments.every((targetDepartment) => cacheDepartments.some((obj) => obj.id === targetDepartment))) {
        throw new Error(`Wrong departments ids.`);
    }
};

const positionsValidation = (positions: string | string[], cachePositions: IDep[]) => {
    const targetPositions = Array.isArray(positions) ? positions : [positions];
    if (!targetPositions.every((targetPosition) => cachePositions.some((obj) => obj.position === targetPosition))) {
        throw new Error(`Wrong positions names.`);
    }
}

const yearsValidation = (years: number[], cacheYears: {year: number}[]) => {
    if (!years.every((year) => cacheYears.some((obj) => obj.year === year))) {
        throw new Error(`No data for this years exists.`);
    }
}

export interface IStatisticWhere {
    inst: string | string[],
    position?: string | string[],
}

export interface IActiveYearsWhere {
    inst: string | string[],
    position?: string | string[] | undefined,
}
  
export interface IStatistics {
    avg_hindex: number;
    sum_publications: number;
    sum_citations: number;
    avg_hindex5: number;
    sum_publications5: number;
    sum_citations5: number;
    avg_publications_per_staff: number;
    avg_citations_per_staff: number;
    avg_publications_per_staff_per_year: number;
    avg_citations_per_staff_per_year: number;
}

export interface IStatustucsPerDepartment extends IStatistics {
    inst: string;
}

export interface GroupedData {
    [positionId: string]: {
      total: number;
      data: { year: number; count: number }[];
    };
}

// Academic staff data interfaces
export interface CountPerYear {
    year: number;
    count: number;
}

export interface AcademicData {
    id: string;
    name: string;
    position: string;
    inst: string;
    hindex: number;
    publications: CountPerYear[];
    citations: CountPerYear[];
    hindex5: number;
    citations5: number;
    publications5: number;
    citationTotal: number;
    publicationTotal: number;
    averagePublication: number;
    averageCitation: number;
}

export interface IAcademicStaffData {
    academic_data: AcademicData[];
    years_range: number[];
}