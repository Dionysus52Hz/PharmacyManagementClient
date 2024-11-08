import { z } from 'zod';

export const manufacturerSchema = z.object({
   manufacturer_id: z.string(),
   name: z.string(),
   nation: z.string(),
});

export type Manufacturer = z.infer<typeof manufacturerSchema>;
