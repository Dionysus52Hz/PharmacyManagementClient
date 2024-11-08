import { z } from 'zod';

export const medicineCategorySchema = z.object({
   category_id: z.string(),
   name: z.string(),
   description: z.string(),
});

export type MedicineCategory = z.infer<typeof medicineCategorySchema>;
