import { z } from "zod";

export const userRoleSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  full_name: z.string(),
  role: z.string().nullable(),
  last_login_at: z.string().nullable(),
  is_active: z.boolean().optional(),
  total_organizer: z.number().optional(),
  total_event: z.number().optional(),
  created_at: z.string(),
});

export type UserRole = z.infer<typeof userRoleSchema>;
