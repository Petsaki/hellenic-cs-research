import { ZodError, z } from "zod";

// REQUEST BODY

// Filter
// Enum if i want to use it in the feature
const deparmentFilterEnum = z.enum(["id"]);

export const FilterSchema = z.object({
    filter: z.string()
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


// Academic Data required value Array WITH PAGINATION
export const AcademicDataPaginationSchema = AcademicDataSchema.extend({
    page: z.coerce.number().min(0),
    size: z.coerce.number().min(1).max(500).default(25)
});

export type AcademicDataPaginationRequest = z.infer<typeof AcademicDataPaginationSchema>;

// Department Analytics Array
export const DepartmentsAnalyticsReqSchema = z.object({
    years: z.array(z.number()),
    positions: z.union([z.string(), z.array(z.string())])
});

export type DepartmentsAnalyticsReq = z.infer<typeof DepartmentsAnalyticsReqSchema>;

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