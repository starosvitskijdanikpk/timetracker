import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";

  let status = 500;
  const lower = message.toLowerCase();

  if (lower.includes("not found")) {
    status = 404;
  } else if (
    lower.includes("cannot delete") ||
    lower.includes("already stopped")
  ) {
    status = 400;
  }

  res.status(status).json({ error: message });
}


