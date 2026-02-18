import type { TaskName } from "@prisma/client";
import { search as searchTaskNames, upsert as upsertTaskName } from "../repositories/taskNameRepository.js";

export async function search(q: string): Promise<TaskName[]> {
  if (!q || q.trim() === "") {
    return [];
  }
  return searchTaskNames(q.trim());
}

export async function upsert(name: string): Promise<TaskName> {
  if (!name || name.trim() === "") {
    throw new Error("Task name must not be empty");
  }
  return upsertTaskName(name.trim());
}

