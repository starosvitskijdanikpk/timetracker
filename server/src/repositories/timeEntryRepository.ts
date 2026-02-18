import { prisma } from "../prismaClient.js";
import type { TimeEntry, Project } from "@prisma/client";

export async function findByDate(
  date: Date,
  tzOffsetMinutes: number = 0,
): Promise<(TimeEntry & { project: Project | null })[]> {
  // Get date string in local timezone (YYYY-MM-DD format)
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Apply timezone offset to UTC boundaries
  const offsetMs = tzOffsetMinutes * 60 * 1000;
  const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0) - offsetMs);
  const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999) - offsetMs);

  return prisma.timeEntry.findMany({
    where: {
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      project: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });
}

export async function findActive(): Promise<
  (TimeEntry & { project: Project | null }) | null
> {
  return prisma.timeEntry.findFirst({
    where: { endTime: null },
    include: { project: true },
    orderBy: { startTime: "asc" },
  });
}

export async function findByDateRange(
  from: Date,
  to: Date,
  tzOffsetMinutes: number = 0,
): Promise<(TimeEntry & { project: Project | null })[]> {
  // Apply timezone offset to UTC boundaries
  const offsetMs = tzOffsetMinutes * 60 * 1000;
  const startOfDay = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), 0, 0, 0, 0) - offsetMs);
  const endOfDay = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate(), 23, 59, 59, 999) - offsetMs);

  return prisma.timeEntry.findMany({
    where: {
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      project: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });
}

export async function findById(
  id: string,
): Promise<(TimeEntry & { project: Project | null }) | null> {
  return prisma.timeEntry.findUnique({
    where: { id },
    include: { project: true },
  });
}

export async function create(data: {
  taskName: string;
  projectId?: string;
  startTime: Date;
}): Promise<TimeEntry> {
  return prisma.timeEntry.create({
    data: {
      taskName: data.taskName,
      projectId: data.projectId ?? null,
      startTime: data.startTime,
    },
  });
}

export async function update(
  id: string,
  data: {
    taskName?: string;
    projectId?: string;
    startTime?: Date;
    endTime?: Date | null;
    duration?: number | null;
  },
): Promise<TimeEntry> {
  return prisma.timeEntry.update({
    where: { id },
    data: {
      ...data,
      projectId: data.projectId ?? undefined,
    },
  });
}

export async function stopActive(
  id: string,
  endTime: Date,
  duration: number,
): Promise<TimeEntry> {
  return prisma.timeEntry.update({
    where: { id },
    data: {
      endTime,
      duration,
    },
  });
}

export async function deleteById(id: string): Promise<void> {
  await prisma.timeEntry.delete({
    where: { id },
  });
}


