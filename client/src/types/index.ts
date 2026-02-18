export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface TimeEntry {
  id: string;
  taskName: string;
  projectId: string | null;
  project: Project | null;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  createdAt: string;
}

export interface TaskName {
  id: string;
  name: string;
  usedAt: string;
}

export interface ReportEntry extends TimeEntry {}

export interface ReportData {
  entries: TimeEntry[];
  totalByProject: { project: Project | null; totalDuration: number }[];
  grandTotal: number;
}

export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}
