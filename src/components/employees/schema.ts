import { z } from 'zod';

export const employeeSchema = z.object({
   employee_id: z.string(),
   username: z.string(),
   fullname: z.string(),
   address: z.string(),
   phoneNumber: z.string(),
   role: z.string(),
   isLocked: z.number(),
});

export type Employee = z.infer<typeof employeeSchema>;
