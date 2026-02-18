export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}

export interface ProjectDTO {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface TimeEntryDTO {
  id: string;
  taskName: string;
  projectId: string | null;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  createdAt: Date;
}

export interface TaskNameDTO {
  id: string;
  name: string;
  usedAt: Date;
}

