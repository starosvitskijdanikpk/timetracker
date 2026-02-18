import type { Request, Response, NextFunction } from "express";
import * as taskNameService from "../services/taskNameService.js";
import type { ApiResponse } from "../shared/index.js";

export async function search(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const q = req.query.q as string || "";
    const taskNames = await taskNameService.search(q);
    const body: ApiResponse = { data: taskNames };
    res.json(body);
  } catch (err) {
    next(err);
  }
}

