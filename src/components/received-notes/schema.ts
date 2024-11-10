import { z } from 'zod';

export const receivedNoteSchema = z.object({
   received_note_id: z.string(),
   employee_id: z.string(),
   supplier_id: z.string(),
   received_date: z.string(),
   details: z.array(
      z.object({
         medicine_id: z.string(),
         quantity: z.number(),
         price: z.number(),
      })
   ),
});

export type ReceivedNote = z.infer<typeof receivedNoteSchema>;
