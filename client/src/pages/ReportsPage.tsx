import { useState } from "react";
import { ReportFilters } from "../features/reports/ReportFilters.js";
import { ReportView } from "../features/reports/ReportView.js";
import { ExportButton } from "../features/reports/ExportButton.js";
import { useReport } from "../hooks/useReport.js";

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const ReportsPage = () => {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDateRange = () => {
    const from = new Date(currentDate);
    const to = new Date(currentDate);

    switch (period) {
      case "day":
        // Use local date string for day period
        return {
          from: getLocalDateString(currentDate),
          to: getLocalDateString(currentDate)
        };
      case "week":
        // Get Monday of the week
        const dayOfWeek = currentDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, need to go back to Monday
        from.setDate(currentDate.getDate() + mondayOffset);
        to.setDate(from.getDate() + 6); // Sunday
        break;
      case "month":
        // First day of month
        from.setDate(1);
        // Last day of month
        to.setMonth(currentDate.getMonth() + 1);
        to.setDate(0); // Last day of previous month (which is current month)
        break;
    }

    return {
      from: getLocalDateString(from),
      to: getLocalDateString(to)
    };
  };

  const { from, to } = getDateRange();
  const { reportData, isLoading } = useReport({ from, to });

  const handlePeriodChange = (newPeriod: "day" | "week" | "month") => {
    setPeriod(newPeriod);
    // Reset to appropriate date for new period
    const newDate = new Date();
    if (newPeriod === "week") {
      // Set to Monday of current week
      const dayOfWeek = newDate.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      newDate.setDate(newDate.getDate() + mondayOffset);
    } else if (newPeriod === "month") {
      // Set to first day of current month
      newDate.setDate(1);
    }
    setCurrentDate(newDate);
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold text-primary">
          Звіти
        </h1>
        
        {reportData && (
          <ExportButton entries={reportData.entries} />
        )}
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ReportFilters
          period={period}
          onPeriodChange={handlePeriodChange}
          currentDate={currentDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Report view */}
      <ReportView reportData={reportData} isLoading={isLoading} />
    </div>
  );
};
