import { z } from 'zod';

export const receivedNoteSchema = z.object({
   received_note_id: z.string(),
   employee_id: z.string(),
   supplier_id: z.string(),
   received_date: z.string(),
   total_price: z.number(),
   // details: z.array(z.string()),
});

export type ReceivedNote = z.infer<typeof receivedNoteSchema>;
