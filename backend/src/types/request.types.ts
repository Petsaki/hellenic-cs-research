import { ZodError, z } from "zod";

// REQUEST BODY

// Filter
// Enum if i want to use it in the feature
const deparmentFilterEnum = z.enum(["id"]);

export const FilterSchema = z.object({
    filter: z.string().optional()
})

export type Filter = z.infer<typeof FilterSchema>;

// Department string
export const DepartmentSchema = z.object({
    department: z.string()
})

export type DepartmentReq = z.infer<typeof DepartmentSchema>;


// Departments Array OR string
export const DepartmentsSchema = z.object({
    departments: z.union([z.string(), z.array(z.string())])
})

export type Departments = z.infer<typeof DepartmentsSchema>;

export const DepartmentsReqSchema = z.object({
    departments: z
    .union([z.string(), z.array(z.string())])
    .refine((value) => {
        if (Array.isArray(value)) {
            return value.length > 0;
        } else {
            return value.trim().length > 0
        }
    }, {
        message: "departments can't be empty.",
    }),
})

export type DepartmentsReq = z.infer<typeof DepartmentsReqSchema>;


// Statistics required value Array
export const StatisticReqSchema = z.object({
    departments: DepartmentsReqSchema.shape.departments,
    positions: z.union([z.string(), z.array(z.string())]).optional()
});

export type StatisticReq = z.infer<typeof StatisticReqSchema>;


// Academic Data required value Array
export const AcademicDataSchema = StatisticReqSchema.extend({
    years: z.array(z.number())
});
export type AcademicDataRequest = z.infer<typeof AcademicDataSchema>;

// Express Query

const customYearsValidation = (years: string): number[] | ZodError => {
    const yearsArray = years.split(',');

    if (yearsArray.length !== 2) {
        throw new ZodError([
            {
                code: yearsArray.length > 2 ? 'too_big' : 'too_small',
                minimum: 2,
                maximum: 2,
                type: 'array',
                inclusive: true,
                exact: true,
                path: ["years"],
                message: 'Array must contain exactly 2 element(s)',
            }
        ]);
    }

    const yearsRange = yearsArray.map((item) => parseInt(item, 10));

    if (yearsRange.some(isNaN)) {
      throw new ZodError([
        {
            code: "invalid_type",
            expected: "number",
            received: "string",
            path: ["years"],
            message: "expected number, received string",
        },
      ]);
    }
  
    return yearsRange;
};

// AcademicPositionTotals
export const AcademicPositionTotalsSchema = z.object({
    years: z.string().nonempty().refine(customYearsValidation),
    departments: z.string().nonempty(),
    positions: z.string().nonempty(),
});

export type AcademicPositionTotalsRequest = z.infer<typeof AcademicPositionTotalsSchema>;


export const AcademicStaffResearchSummarySchema = z.object({
    departments: z.string().nonempty(),
    positions: z.string().nonempty(),
});

export type AcademicStaffResearchSummaryRequest = z.infer<typeof AcademicStaffResearchSummarySchema>;

// getPositionsCountByDepartment
export const PositionsCountByDepsSchema = z.object({
    departments: z.string().nonempty()
});

export type PositionsCountByDepsRequest = z.infer<typeof PositionsCountByDepsSchema>;


// Academic Data required value Array WITH PAGINATION
const customPageValidation = (pageString: string): string | ZodError => {

    const page = parseInt(pageString, 10);
    
    if (page !== 0 && isNaN(page)) {
      throw new ZodError([
        {
            code: "invalid_type",
            expected: "number",
            received: "string",
            path: ["page"],
            message: "expected number, received string",
        },
      ]);
    }

    if (page < 0) {
        throw new ZodError([
          {
              code: "too_small",
              minimum: 0,
              inclusive: true,
              type: 'number',
              path: ["page"],
              message: "Page must be a non-negative number.",
          },
        ]);
      }
  
    return page.toString();
};

const customSizeValidation = (sizeString: string): string | ZodError => {

    // Default 25
    if (sizeString == null) return '25';

    const size = parseInt(sizeString, 10);

    if (isNaN(size)) {
      throw new ZodError([
        {
            code: "invalid_type",
            expected: "number",
            received: "string",
            path: ["size"],
            message: "expected number, received string",
        },
      ]);
    }

    if (size < 1 || size > 500) {
        throw new ZodError([
          {
              code: size < 1 ? "too_small" : "too_big",
              minimum: 1,
              maximum: 500,
              inclusive: true,
              type: 'number',
              path: ["size"],
              message: "Size must be 0 < size < 501",
          },
        ]);
      }
  
    return size.toString();
};

export const AcademicDataPaginationSchema = AcademicPositionTotalsSchema.extend({
    page: z.string().nonempty().refine(customPageValidation),
    size: z.string().refine(customSizeValidation).default('25'),
    positions: z.string().optional(),
});

export type AcademicDataPaginationRequest = z.infer<typeof AcademicDataPaginationSchema>;

// DepartmentWithOptionalPositions - it is using by many endpoints
export const DepartmentWithOptionalPositionsSchema = z.object({
    departments: z.string().nonempty(),
    positions: z.string().optional()
});

export type DepartmentWithOptionalPositions = z.infer<typeof DepartmentWithOptionalPositionsSchema>;

// DepartmentsAnalyticsData
export const DepartmentsAnalyticsReqSchema = AcademicPositionTotalsSchema.extend({
    departments: z.string().optional(),
    positions: z.string().optional()
});

export type DepartmentsAnalyticsReq = z.infer<typeof DepartmentsAnalyticsReqSchema>;