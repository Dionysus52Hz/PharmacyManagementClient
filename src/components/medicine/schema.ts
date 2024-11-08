import { z } from 'zod';

export const medicineSchema = z.object({
   medicine_id: z.string(),
   name: z.string(),
   manufacture_id: z.string(),
   supplier_id: z.string(),
   effects: z.string(),
   category_id: z.string(),
});

export type Medicine = z.infer<typeof medicineSchema>;
