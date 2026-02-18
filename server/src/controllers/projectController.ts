import type { Request, Response, NextFunction } from "express";
import * as projectService from "../services/projectService.js";
import type { ApiResponse } from "../shared/index.js";

export async function getAll(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const projects = await projectService.getAll();
    const body: ApiResponse = { data: projects };
    res.json(body);
  } catch (err) {
    next(err);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await projectService.getById(req.params.id);
    const body: ApiResponse = { data: project };
    res.json(body);
  } catch (err) {
    next(err);
  }
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await projectService.create(req.body);
    const body: ApiResponse = { data: project };
    res.status(201).json(body);
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
    const project = await projectService.update(req.params.id, req.body);
    const body: ApiResponse = { data: project };
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
    await projectService.remove(req.params.id);
    const body: ApiResponse = { data: { success: true } };
    res.json(body);
  } catch (err) {
    next(err);
  }
}


