import { api } from "./api.js";
import type { TimeEntry, ReportData } from "../types/index.js";

export const timeEntriesApi = {
  getByDate: async (date: string): Promise<TimeEntry[]> => {
    const response = await api.get(`/api/time-entries?date=${date}`);
    return response.data.data; // Return array directly, not wrapped
  },
  
  getActive: async (): Promise<TimeEntry | null> => {
    const response = await api.get("/api/time-entries/active");
    return response.data.data; // Unwrap here too
  },

  start: async (data: { taskName: string; projectId?: string }): Promise<TimeEntry> => {
    const response = await api.post("/api/time-entries/start", data);
    return response.data.data; // Unwrap here too
  },
  
  stop: async (id: string): Promise<TimeEntry> => {
    const response = await api.post(`/api/time-entries/stop/${id}`);
    return response.data.data; // Unwrap here too
  },
  
  update: async (id: string, data: {
    taskName?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    projectId?: string;
  }): Promise<TimeEntry> => {
    const response = await api.put(`/api/time-entries/${id}`, data);
    return response.data.data; // Unwrap here too
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/time-entries/${id}`);
  },

  getReport: async (from: string, to: string): Promise<ReportData> => {
    const response = await api.get(`/api/time-entries/report?from=${from}&to=${to}`);
    console.log('[API] Report response:', response.data);
    return response.data.data;
  },
};
