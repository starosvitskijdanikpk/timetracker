import { prisma } from "../prismaClient.js";
import type { TaskName } from "@prisma/client";

export async function search(q: string): Promise<TaskName[]> {
  return prisma.taskName.findMany({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
    orderBy: { usedAt: "desc" },
    take: 5,
  });
}

export async function upsert(name: string): Promise<TaskName> {
  return prisma.taskName.upsert({
    where: { name },
    update: { usedAt: new Date() },
    create: { name },
  });
}

