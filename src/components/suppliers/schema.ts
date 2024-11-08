import { z } from 'zod';

export const supplierSchema = z.object({
   supplier_id: z.string(),
   name: z.string(),
   address: z.string(),
   representative: z.string(),
});

export type Supplier = z.infer<typeof supplierSchema>;
