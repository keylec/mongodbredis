import { z } from "zod";

export const taskSchema = z.object({
  title: z.string(),
  description: z.string({
    required_error: "Description is required",
  }),
});
