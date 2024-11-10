import { z } from 'zod';

export const deliveryNoteDetailsSchema = z.object({
   delivery_note_id: z.string(),
   medicine_id: z.string(),
   medicine_name: z.string(),
   quantity: z.number(),
   price: z.number(),
});

export type DeliveryNoteDetails = z.infer<typeof deliveryNoteDetailsSchema>;
