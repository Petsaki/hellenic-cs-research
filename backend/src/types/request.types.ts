import { z } from "zod";

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