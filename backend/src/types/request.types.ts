import { z } from "zod";

// REQUEST BODY

// Filter
// Enum if i want to use it in the feature
const deparmentFilterEnum = z.enum(["id"]);

export const FilterSchema = z.object({
    filter: z.string()
})

export type Filter = z.infer<typeof FilterSchema>;


// Departments Array
export const DepartmentsSchema = z.object({
    departments: z.union([z.string(), z.array(z.string())])
})

export type Departments = z.infer<typeof DepartmentsSchema>;

// Statistics required value Array
export const DepartmentsRequiredSchema = z.object({
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
    positions: z.union([z.string(), z.array(z.string())]).optional()
});

export type DepartmentsRequired = z.infer<typeof DepartmentsRequiredSchema>;