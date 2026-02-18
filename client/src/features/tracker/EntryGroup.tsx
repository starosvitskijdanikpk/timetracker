import { EntryRow } from "./EntryRow.js";
import { useTimerStore } from "../../store/timerStore.js";
import type { TimeEntry } from "../../types/index.js";

interface EntryGroupProps {
  projectName: string;
  projectColor: string;
  entries: TimeEntry[];
  totalDuration: number;
  onUpdate: () => void;
}

export const EntryGroup = ({ 
  projectName, 
  projectColor, 
  entries, 
  totalDuration, 
  onUpdate 
}: EntryGroupProps) => {
  const activeEntry = useTimerStore((state) => state.activeEntry);
  const elapsedSeconds = useTimerStore((state) => state.elapsedSeconds);

  // Check if the active entry belongs to this project
  const activeInThisProject = entries.some(e => e.id === activeEntry?.id);

  // Compute live total duration
  const completedDuration = totalDuration; // This is passed as prop
  const liveTotalDuration = completedDuration + (activeInThisProject ? elapsedSeconds : 0);

  const formatTotalDuration = () => {
    const hours = Math.floor(liveTotalDuration / 3600);
    const minutes = Math.floor((liveTotalDuration % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card rounded-xl border border-white/[0.06] overflow-hidden">
      {/* Group header */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-surface border border-white/[0.06] rounded-t-xl">
        {/* Project color indicator */}
        <div 
          className="w-1 h-4 rounded-full flex-shrink-0" 
          style={{ backgroundColor: projectColor }}
        ></div>
        
        {/* Project name */}
        <div className="text-sm font-semibold text-primary flex-1">
          {projectName}
        </div>
        
        {/* Total duration */}
        <div className="font-mono text-xs bg-elevated rounded px-2 py-1 text-secondary">
          {formatTotalDuration()}
        </div>
      </div>

      {/* Entries */}
      <div className="divide-y divide-white/[0.06]">
        {entries.map((entry) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            onUpdate={onUpdate}
            onDelete={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};
