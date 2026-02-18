import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../shared/index.js";

export function validateRequestPlaceholder(
  _req: Request,
  _res: Response,
  _next: NextFunction,
): ApiResponse {
  return { message: "not implemented" };
}

