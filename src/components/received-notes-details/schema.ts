import { z } from 'zod';

export const receivedNoteDetailsSchema = z.object({
   received_note_id: z.string(),
   medicine_id: z.string(),
   medicine_name: z.string(),
   quantity: z.number(),
   price: z.number(),
});

export type ReceivedNoteDetails = z.infer<typeof receivedNoteDetailsSchema>;
