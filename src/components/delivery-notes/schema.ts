import { z } from 'zod';

export const deliveryNoteSchema = z.object({
   delivery_note_id: z.string(),
   employee_id: z.string(),
   customer_id: z.string(),
   delivery_date: z.string(),
   details: z.array(
      z.object({
         medicine_id: z.string(),
         quantity: z.number(),
         price: z.number(),
      })
   ),
});

export type DeliveryNote = z.infer<typeof deliveryNoteSchema>;
