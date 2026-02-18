import { Router } from "express";
import * as projectController from "../controllers/projectController.js";

export const projectsRouter = Router();

projectsRouter.get("/", projectController.getAll);
projectsRouter.get("/:id", projectController.getById);
projectsRouter.post("/", projectController.create);
projectsRouter.put("/:id", projectController.update);
projectsRouter.delete("/:id", projectController.remove);


