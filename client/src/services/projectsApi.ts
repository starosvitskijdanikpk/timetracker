import { api } from "./api.js";
import type { Project } from "../types/index.js";

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get("/api/projects");
    return response.data.data;
  },
  
  create: async (data: { name: string; color: string }): Promise<Project> => {
    const response = await api.post("/api/projects", data);
    return response.data.data;
  },
  
  update: async (id: string, data: { name?: string; color?: string }): Promise<Project> => {
    const response = await api.put(`/api/projects/${id}`, data);
    return response.data.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/projects/${id}`);
  },
};
