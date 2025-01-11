import { z } from 'zod';

export const authSchema = z.object({
  name: z.string().min(3),
  dob: z.string().transform((val) => new Date(val)),
  email: z.string().email(),
});