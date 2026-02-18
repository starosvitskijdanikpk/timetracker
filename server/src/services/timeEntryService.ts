import type { TimeEntry, Project } from "@prisma/client";
import {
  create,
  deleteById,
  findActive,
  findByDate,
  findByDateRange,
  findById,
  stopActive,
  update as updateEntry,
} from "../repositories/timeEntryRepository.js";
import { prisma } from "../prismaClient.js";

type TimeEntryWithProject = TimeEntry & { project: Project | null };

function parseDateOnly(dateStr: string): Date {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid date format");
  }
  return d;
}

async function cleanupUnusedTaskNames(taskName: string) {
  // Check if this task name is still used by any entry
  const entriesWithName = await prisma.timeEntry.count({
    where: { taskName }
  });
  
  // If no entries use it, delete the TaskName record
  if (entriesWithName === 0) {
    await prisma.taskName.deleteMany({
      where: { name: taskName }
    });
  }
}

export async function getByDate(dateStr: string, tzOffsetMinutes: number = 0): Promise<TimeEntryWithProject[]> {
  const date = parseDateOnly(dateStr);
  return findByDate(date, tzOffsetMinutes);
}

export async function getActive(): Promise<TimeEntryWithProject | null> {
  return findActive();
}

export async function getReport(fromStr: string, toStr: string, tzOffsetMinutes: number = 0): Promise<{
  entries: TimeEntryWithProject[];
  totalByProject: { project: Project | null; totalDuration: number }[];
  grandTotal: number;
}> {
  const from = parseDateOnly(fromStr);
  const to = parseDateOnly(toStr);

  const entries = await findByDateRange(from, to, tzOffsetMinutes);

  const totals = new Map<string | null, { project: Project | null; total: number }>();
  let grandTotal = 0;

  for (const entry of entries) {
    const duration = entry.duration ?? 0;
    grandTotal += duration;

    const key = entry.projectId ?? null;
    const existing = totals.get(key);
    if (existing) {
      existing.total += duration;
    } else {
      totals.set(key, { project: entry.project ?? null, total: duration });
    }
  }

  const totalByProject = Array.from(totals.values()).map((t) => ({
    project: t.project,
    totalDuration: t.total,
  }));

  return {
    entries,
    totalByProject,
    grandTotal,
  };
}

export async function start(data: {
  taskName: string;
  projectId?: string;
}): Promise<TimeEntry> {
  if (!data.taskName || data.taskName.trim().length === 0) {
    throw new Error("Task name must not be empty");
  }

  const now = new Date();

  const active = await findActive();
  if (active) {
    const durationSeconds = Math.floor(
      (now.getTime() - active.startTime.getTime()) / 1000,
    );
    await stopActive(active.id, now, durationSeconds);
  }

  const entry = await create({
    taskName: data.taskName.trim(),
    projectId: data.projectId,
    startTime: now,
  });

  // Upsert TaskName
  // We intentionally keep this here to avoid leaking Prisma into the service;
  // if we later add a TaskNameRepository, this can be moved there.
  const { prisma } = await import("../prismaClient.js");
  await prisma.taskName.upsert({
    where: { name: data.taskName.trim() },
    update: { usedAt: now },
    create: { name: data.taskName.trim(), usedAt: now },
  });

  return entry;
}

export async function stop(id: string): Promise<TimeEntry> {
  const existing = await findById(id);
  if (!existing) {
    throw new Error("Entry not found");
  }

  if (existing.endTime !== null) {
    throw new Error("Entry already stopped");
  }

  const now = new Date();
  const durationSeconds = Math.floor(
    (now.getTime() - existing.startTime.getTime()) / 1000,
  );

  return stopActive(id, now, durationSeconds);
}

export async function update(
  id: string,
  data: {
    taskName?: string;
    projectId?: string;
    startTime?: string;  // Received as ISO string from client
    endTime?: string;    // Received as ISO string from client
    duration?: number;
  },
): Promise<TimeEntry> {
  const existing = await findById(id);
  if (!existing) {
    throw new Error("Entry not found");
  }

  // If times are provided, recalculate duration
  let calculatedDuration = data.duration;
  
  if (data.startTime || data.endTime) {
    // Convert string to Date
    const newStart = data.startTime ? new Date(data.startTime) : new Date(existing.startTime);
    const newEnd = data.endTime ? new Date(data.endTime) : (existing.endTime ? new Date(existing.endTime) : new Date());
    
    // Calculate duration in seconds
    calculatedDuration = Math.floor((newEnd.getTime() - newStart.getTime()) / 1000);
  }

  // Update with calculated duration
  const updateData: any = {
    ...data,
    duration: calculatedDuration,
  };
  
  // Convert string times back to Date for repository
  if (data.startTime) {
    updateData.startTime = new Date(data.startTime);
  }
  if (data.endTime) {
    updateData.endTime = new Date(data.endTime);
  }

  const updated = await updateEntry(id, updateData);

  return updated;
}

export async function remove(id: string): Promise<void> {
  const existing = await findById(id);
  if (!existing) {
    throw new Error("Entry not found");
  }
  
  const taskName = existing.taskName; // Save before deletion
  
  await deleteById(id);
  
  // Cleanup unused task name
  await cleanupUnusedTaskNames(taskName);
}


