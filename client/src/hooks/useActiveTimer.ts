import { useEffect, useRef } from "react";
import { timeEntriesApi } from "../services/timeEntriesApi.js";
import { useTimerStore } from "../store/timerStore.js";

export const useActiveTimer = () => {
  const { setActiveEntry, incrementElapsed } = useTimerStore();
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const activeEntry = await timeEntriesApi.getActive();
        setActiveEntry(activeEntry);
      } catch (error) {
        console.error("Failed to fetch active timer:", error);
      }
    };
    
    fetchActive();

    // Set up interval to increment elapsed time
    intervalRef.current = setInterval(() => {
      incrementElapsed();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [setActiveEntry, incrementElapsed]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
};
