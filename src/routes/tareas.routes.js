import { Router } from "express";

import { auth } from "../middlewares/auth.middleware.js";
import { createTareaSchema } from "../schemas/tarea.schema.js";

const router = Router();

router.get("/tasks", auth, getTasks);

router.post("/tasks", auth, validateSchema(createTaskSchema), createTask);

router.get("/tasks/:id", auth, getTask);

router.put("/tasks/:id", auth, updateTask);

router.delete("/tasks/:id", auth, deleteTask);

export default router;
