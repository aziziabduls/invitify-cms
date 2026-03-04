import { z } from "zod";

export const participantSchema = z.object({
  id: z.number(),
  event_id: z.number(),
  customer_name: z.string(),
  customer_email: z.string().email(),
  customer_phone: z.string(),
  payment_method: z.string(),
  original_price: z.string(),
  discount_code: z.string().nullable(),
  discount_amount: z.string(),
  final_price: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  event_name: z.string(),
});

export type Participant = z.infer<typeof participantSchema>;
