import { Router } from "express";
import * as timeEntryController from "../controllers/timeEntryController.js";

export const timeEntriesRouter = Router();

timeEntriesRouter.get("/", timeEntryController.getByDate);
timeEntriesRouter.get("/active", timeEntryController.getActive);
timeEntriesRouter.get("/report", timeEntryController.getReport);
timeEntriesRouter.post("/start", timeEntryController.start);
timeEntriesRouter.post("/stop/:id", timeEntryController.stop);
timeEntriesRouter.put("/:id", timeEntryController.update);
timeEntriesRouter.delete("/:id", timeEntryController.remove);


