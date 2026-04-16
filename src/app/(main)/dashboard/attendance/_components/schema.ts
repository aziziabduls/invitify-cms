import { z } from "zod";

export const attendanceSchema = z.object({
  id: z.number(),
  customer_name: z.string(),
  customer_email: z.string().email(),
  event_name: z.string(),
  attended_at: z.string().nullable(),
  status: z.enum(["pending", "attended"]),
});

export type Attendance = z.infer<typeof attendanceSchema>;
