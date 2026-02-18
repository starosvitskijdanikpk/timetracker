import { useState } from "react";

interface ReportFiltersProps {
  period: "day" | "week" | "month";
  onPeriodChange: (period: "day" | "week" | "month") => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const ReportFilters = ({ 
  period, 
  onPeriodChange, 
  currentDate, 
  onDateChange 
}: ReportFiltersProps) => {
  const getPeriodLabel = () => {
    switch (period) {
      case "day":
        return currentDate.toLocaleDateString('uk-UA', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      case "week":
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return `${weekStart.toLocaleDateString('uk-UA', { 
          day: 'numeric' 
        })} – ${weekEnd.toLocaleDateString('uk-UA', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}`;
      case "month":
        return currentDate.toLocaleDateString('uk-UA', { 
          month: 'long', 
          year: 'numeric' 
        });
      default:
        return "";
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (period) {
      case "day":
        newDate.setDate(currentDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (period) {
      case "day":
        newDate.setDate(currentDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
    onDateChange(newDate);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Period toggle pills */}
      <div className="flex gap-2">
        {[
          { value: "day", label: "День" },
          { value: "week", label: "Тиждень" },
          { value: "month", label: "Місяць" }
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onPeriodChange(value as "day" | "week" | "month")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              period === value
                ? "bg-amber text-void font-bold"
                : "bg-elevated text-secondary hover:text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Date navigator */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrevious}
          className="bg-elevated rounded-lg w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-sm font-medium text-primary">
          {getPeriodLabel()}
        </div>
        
        <button
          onClick={handleNext}
          className="bg-elevated rounded-lg w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
