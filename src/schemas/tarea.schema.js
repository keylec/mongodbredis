import { z } from "zod";

export const createTareaSchema = z.object({
    description: z.string().optional(),
    // date: z.string().datetime().optional(),
  });