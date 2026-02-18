import type { Project } from "@prisma/client";
import {
  create as createProject,
  deleteById,
  findAll,
  findById,
  hasTimeEntries,
  update as updateProject,
} from "../repositories/projectRepository.js";
import { prisma } from "../prismaClient.js";

const COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

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

export async function getAll(): Promise<Project[]> {
  return findAll();
}

export async function getById(id: string): Promise<Project> {
  const project = await findById(id);
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
}

export async function create(data: {
  name: string;
  color: string;
}): Promise<Project> {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error("Project name must not be empty");
  }

  if (!COLOR_REGEX.test(data.color)) {
    throw new Error("Project color must be a valid hex color");
  }

  return createProject({
    name: data.name.trim(),
    color: data.color,
  });
}

export async function update(
  id: string,
  data: { name?: string; color?: string },
): Promise<Project> {
  const existing = await findById(id);
  if (!existing) {
    throw new Error("Project not found");
  }

  const updateData: { name?: string; color?: string } = {};

  if (data.name !== undefined) {
    if (data.name.trim().length === 0) {
      throw new Error("Project name must not be empty");
    }
    updateData.name = data.name.trim();
  }

  if (data.color !== undefined) {
    if (!COLOR_REGEX.test(data.color)) {
      throw new Error("Project color must be a valid hex color");
    }
    updateData.color = data.color;
  }

  return updateProject(id, updateData);
}

export async function remove(id: string): Promise<void> {
  const existing = await findById(id);
  if (!existing) {
    throw new Error("Project not found");
  }

  // Get all task names before deletion
  const entries = await prisma.timeEntry.findMany({
    where: { projectId: id },
    select: { taskName: true }
  });
  const taskNames = [...new Set(entries.map(e => e.taskName))];
  
  // Delete all time entries for this project first
  await prisma.timeEntry.deleteMany({
    where: { projectId: id }
  });

  // Then delete the project
  await deleteById(id);
  
  // Cleanup unused task names
  for (const taskName of taskNames) {
    await cleanupUnusedTaskNames(taskName);
  }
}


