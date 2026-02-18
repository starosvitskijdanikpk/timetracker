import cors from "cors";
import express from "express";

import { projectsRouter } from "./routes/projects.js";
import { timeEntriesRouter } from "./routes/timeEntries.js";
import { taskNamesRouter } from "./routes/taskNames.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/projects", projectsRouter);
app.use("/api/time-entries", timeEntriesRouter);
app.use("/api/task-names", taskNamesRouter);

// Error handler (must be last)
app.use(errorHandler);

