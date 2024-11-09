import { z } from 'zod';

export const customerSchema = z.object({
   customer_id: z.string(),
   name: z.string(),
   phone: z.string(),
   address: z.string(),
});

export type Customer = z.infer<typeof customerSchema>;
