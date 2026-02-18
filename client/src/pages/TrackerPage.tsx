import { TaskInputForm } from "../features/tracker/TaskInputForm.js";
import { EntryList } from "../features/tracker/EntryList.js";
import { useTimeEntries } from "../hooks/useTimeEntries.js";
import { useEffect } from "react";

export const TrackerPage = () => {
  const { entries, isLoading, refetch } = useTimeEntries();

  useEffect(() => {
    const handleTimerStopped = () => {
      refetch();
    };
    
    window.addEventListener('timer-stopped', handleTimerStopped);
    
    return () => {
      window.removeEventListener('timer-stopped', handleTimerStopped);
    };
  }, [refetch]);

  const handleEntryStarted = () => {
    refetch();
  };

  const handleEntryUpdate = () => {
    refetch();
  };

  return (
    <div className="p-8 max-w-4xl">
      <TaskInputForm onEntryStarted={handleEntryStarted} />
        
      {entries.length > 0 ? (
        <EntryList 
          key={entries.length + entries.map(e => e.duration).join(',')} 
          entries={entries} 
          onUpdate={handleEntryUpdate} 
        />
      ) : (
        <div className="text-center py-12">
          <div className="text-secondary mb-2">
            Немає записів для сьогодні
          </div>
          <div className="text-dim text-sm">
            Почніть відстежувати час, щоб побачити записи тут
          </div>
        </div>
      )}
    </div>
  );
};
