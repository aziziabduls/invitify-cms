import { z } from "zod";

export const organizerSchema = z.object({
  id: z.number(),
  name: z.string(),
  domain: z.string(),
  scope: z.string(),
  category: z.string(),
  format: z.enum(["hybrid", "non-hybrid"]),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Organizer = z.infer<typeof organizerSchema>;

export const createOrganizerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  domain: z.string().min(2, "Domain must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Domain can only contain lowercase letters, numbers, and hyphens"),
  scope: z.string().min(1, "Scope is required"),
  category: z.string().min(1, "Category is required"),
  format: z.enum(["hybrid", "non-hybrid"]),
});

export type CreateOrganizer = z.infer<typeof createOrganizerSchema>;
