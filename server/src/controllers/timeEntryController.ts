import type { Request, Response, NextFunction } from "express";
import * as timeEntryService from "../services/timeEntryService.js";
import type { ApiResponse } from "../shared/index.js";

export async function getByDate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const dateParam = (req.query.date as string | undefined) ?? "";
    const now = new Date();
  const localDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const dateStr = dateParam || localDateStr;
    const entries = await timeEntryService.getByDate(dateStr);
    const body: ApiResponse = { data: entries };
    res.json(body);
  } catch (err) {
    next(err);
  }
}

export async function getActive(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const entry = await timeEntryService.getActive();
    const body: ApiResponse = { data: entry };
    res.json(body);
  } catch (err) {
    next(err);
  }
}

export async function getReport(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    if (!from || !to) {
      throw new Error("from and to query parameters are required");
    }
    const report = await timeEntryService.getReport(from, to);
    const body: ApiResponse = { data: report };
    res.json(body);
  } catch (err) {
    next(err);
  }
}

export async function start(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const entry = await timeEntryService.start(req.body);
    const body: ApiResponse = { data: entry };
    res.status(201).json(body);
  } catch (err) {
    next(err);
  }
}

export async function stop(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const entry = await timeEntryService.stop(req.params.id);
    const body: ApiResponse = { data: entry };
    res.json(body);
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const entry = await timeEntryService.update(req.params.id, req.body);
    const body: ApiResponse = { data: entry };
    res.json(body);
  } catch (err) {
    next(err);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await timeEntryService.remove(req.params.id);
    const body: ApiResponse = { data: { success: true } };
    res.json(body);
  } catch (err) {
    next(err);
  }
}


