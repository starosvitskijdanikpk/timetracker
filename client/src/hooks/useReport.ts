import { useState, useEffect } from "react";
import { timeEntriesApi } from "../services/timeEntriesApi.js";
import type { ReportData } from "../types/index.js";

interface UseReportParams {
  from: string;
  to: string;
}

export const useReport = ({ from, to }: UseReportParams) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      console.log('[useReport] Fetching report for:', { from, to });
      const data = await timeEntriesApi.getReport(from, to);
      console.log('[useReport] Received data:', data);
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [from, to]);

  return { reportData, isLoading, refetch: fetchReport };
};
