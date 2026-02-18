import { api } from "./api.js";
import type { TaskName } from "../types/index.js";

export const taskNamesApi = {
  search: async (q: string): Promise<TaskName[]> => {
    const response = await api.get(`/api/task-names?q=${q}`);
    return response.data.data;
  },
};
