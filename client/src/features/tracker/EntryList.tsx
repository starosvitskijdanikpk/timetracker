import { EntryGroup } from "./EntryGroup.js";
import { EntryRow } from "./EntryRow.js";
import { useTimerStore } from "../../store/timerStore.js";
import { useEffect } from "react";
import type { TimeEntry } from "../../types/index.js";

interface EntryListProps {
  entries: TimeEntry[];
  onUpdate: () => void;
}

export const EntryList = ({ entries, onUpdate }: EntryListProps) => {
  const activeEntry = useTimerStore((state) => state.activeEntry);
  const elapsedSeconds = useTimerStore((state) => state.elapsedSeconds);

  // Debug: Check if entries prop is updating
  useEffect(() => {
    console.log('EntryList entries updated:', {
      entriesCount: entries.length,
      firstEntryDuration: entries[0]?.duration,
      firstEntryId: entries[0]?.id?.slice(0, 8)
    });
  }, [entries]);

  // Group entries by project and sort within each group
  const groupedEntries = entries.reduce((acc, entry) => {
    const key = entry.projectId || 'no-project';
    if (!acc[key]) {
      acc[key] = {
        project: entry.project,
        entries: [],
        totalDuration: 0
      };
    }
    acc[key].entries.push(entry);
    if (entry.duration) {
      acc[key].totalDuration += entry.duration;
    }
    return acc;
  }, {} as Record<string, { project: TimeEntry['project']; entries: TimeEntry[]; totalDuration: number }>);

  // Sort entries within each group: active entries first, then by start time
  Object.keys(groupedEntries).forEach(key => {
    groupedEntries[key].entries.sort((a, b) => {
      // Active entries (endTime === null) come first
      if (a.endTime === null && b.endTime !== null) return -1;
      if (a.endTime !== null && b.endTime === null) return 1;
      // Then by start time (newest first)
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });
  });

  // Sort project groups: groups with active entries first, then by most recent entry
  const sortedGroups = Object.entries(groupedEntries).sort(([, a], [, b]) => {
    // 1. Active projects first
    const aHasActive = a.entries.some(e => e.endTime === null);
    const bHasActive = b.entries.some(e => e.endTime === null);
    if (aHasActive && !bHasActive) return -1;
    if (!aHasActive && bHasActive) return 1;
    
    // 2. Then by most recent entry startTime
    const aLatestTime = Math.max(...a.entries.map(e => new Date(e.startTime).getTime()));
    const bLatestTime = Math.max(...b.entries.map(e => new Date(e.startTime).getTime()));
    return bLatestTime - aLatestTime; // Most recent first
  });

  // Calculate total duration for all entries
  const completedDuration = entries.reduce((total, entry) => 
    total + (entry.duration || 0), 0
  );
  const totalDuration = completedDuration + (activeEntry ? elapsedSeconds : 0);

  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const today = new Date().toLocaleDateString('uk-UA', { 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div>
      {/* Date strip */}
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-card border border-white/[0.06] rounded-full px-3 py-1 text-sm">
          {today}
        </div>
        
        <div className="text-amber bg-amber/15 border border-amber/20 rounded text-[10px] uppercase tracking-wider px-2 py-1">
          Сьогодні
        </div>
        
        <div className="flex-1 h-px bg-white/[0.06]"></div>
        
        <div className="text-dim text-xs">
          Разом:
          <span className="font-mono text-amber text-sm ml-1">
            {formatTotalDuration()}
          </span>
        </div>
      </div>

      {/* Entry groups */}
      <div className="space-y-4">
        {sortedGroups.map(([key, group]) => {
          if (key === 'no-project') {
            // Render entries without project as individual rows
            return (
              <div key="no-project" className="bg-card rounded-xl border border-white/[0.06] overflow-hidden">
                {group.entries.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    onUpdate={onUpdate}
                    onDelete={onUpdate}
                  />
                ))}
              </div>
            );
          }

          return (
            <EntryGroup
              key={key}
              projectName={group.project?.name || 'Без проекту'}
              projectColor={group.project?.color || '#6b7280'}
              entries={group.entries}
              totalDuration={group.totalDuration}
              onUpdate={onUpdate}
            />
          );
        })}
      </div>
    </div>
  );
};
