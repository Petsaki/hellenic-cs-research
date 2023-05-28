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