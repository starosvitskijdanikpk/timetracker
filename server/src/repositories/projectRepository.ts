import { prisma } from "../prismaClient.js";
import type { Project } from "@prisma/client";

export async function findAll(): Promise<Project[]> {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({
    where: { id },
  });
}

export async function findByIdWithEntries(
  id: string,
): Promise<(Project & { timeEntriesCount: number }) | null> {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      _count: {
        select: { timeEntries: true },
      },
    },
  });

  if (!project) {
    return null;
  }

  return {
    id: project.id,
    name: project.name,
    color: project.color,
    createdAt: project.createdAt,
    timeEntriesCount: project._count.timeEntries,
  };
}

export async function create(data: {
  name: string;
  color: string;
}): Promise<Project> {
  return prisma.project.create({
    data,
  });
}

export async function update(
  id: string,
  data: { name?: string; color?: string },
): Promise<Project> {
  return prisma.project.update({
    where: { id },
    data,
  });
}

export async function deleteById(id: string): Promise<void> {
  await prisma.project.delete({
    where: { id },
  });
}

export async function hasTimeEntries(id: string): Promise<boolean> {
  const count = await prisma.timeEntry.count({
    where: { projectId: id },
  });
  return count > 0;
}


