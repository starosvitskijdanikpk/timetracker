import { useState, useEffect } from "react";
import { timeEntriesApi } from "../services/timeEntriesApi.js";
import type { TimeEntry } from "../types/index.js";

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const useTimeEntries = () => {
  const [entries, _setEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Wrap setEntries to log when React actually updates state
  const setEntries = (newEntries: TimeEntry[]) => {
    _setEntries(newEntries);
  };

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const today = getLocalDateString(new Date());
      const result = await timeEntriesApi.getByDate(today);
      
      // Create a NEW array to force React to detect the change
      const newEntries = result ? [...result] : [];
      setEntries(newEntries);
    } catch (error) {
      console.error("[Hook] Failed to fetch entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const refetch = async () => {
    await fetchEntries();
  };

  return { entries, isLoading, refetch };
};
