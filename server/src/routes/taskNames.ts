import { Router } from "express";
import * as taskNameController from "../controllers/taskNameController.js";

export const taskNamesRouter = Router();

taskNamesRouter.get("/", taskNameController.search);

