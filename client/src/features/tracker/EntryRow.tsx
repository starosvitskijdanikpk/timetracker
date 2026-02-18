import { useState, useEffect } from "react";
import { timeEntriesApi } from "../../services/timeEntriesApi.js";
import { useTimerStore } from "../../store/timerStore.js";
import type { TimeEntry } from "../../types/index.js";

interface EntryRowProps {
  entry: TimeEntry;
  onUpdate: () => void;
  onDelete: () => void;
}

export const EntryRow = ({ entry, onUpdate, onDelete }: EntryRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(entry.taskName);
  const [editedTaskName, setEditedTaskName] = useState(entry.taskName);
  const [editedStartTime, setEditedStartTime] = useState('');
  const [editedEndTime, setEditedEndTime] = useState('');
  const activeEntry = useTimerStore((state) => state.activeEntry);
  const elapsedSeconds = useTimerStore((state) => state.elapsedSeconds);
  const lastStoppedDuration = useTimerStore((state) => state.lastStoppedDuration);
  const clearPreservedDuration = useTimerStore((state) => state.clearPreservedDuration);

  const isActive = activeEntry?.id === entry.id;

  // Clear preserved duration once real data arrives
  useEffect(() => {
    if (!isActive && entry.duration !== null && lastStoppedDuration > 0) {
      clearPreservedDuration();
    }
  }, [isActive, entry.duration, lastStoppedDuration, clearPreservedDuration]);

  const formatTimeRange = () => {
    const start = new Date(entry.startTime);
    const end = entry.endTime ? new Date(entry.endTime) : null;
    
    const startTime = start.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    if (end) {
      const endTime = end.toLocaleTimeString('uk-UA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return `${startTime} – ${endTime}`;
    }
    
    return startTime;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${String(minutes).padStart(2, "0")}`;
  };

  const handleEditClick = () => {
  setIsEditing(true);
  setEditedTaskName(entry.taskName);
  
  // Format startTime as HH:MM
  const start = new Date(entry.startTime);
  setEditedStartTime(`${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`);
  
  // Format endTime as HH:MM (if exists)
  if (entry.endTime) {
    const end = new Date(entry.endTime);
    setEditedEndTime(`${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`);
  } else {
    setEditedEndTime('');
  }
};

  const handleSave = async () => {
    try {
      // Parse HH:MM to create new Date objects with today's date
      const [startHour, startMin] = editedStartTime.split(':').map(Number);
      const [endHour, endMin] = editedEndTime.split(':').map(Number);
      
      const startDate = new Date(entry.startTime);
      startDate.setHours(startHour, startMin, 0, 0);
      
      const endDate = entry.endTime ? new Date(entry.endTime) : new Date();
      endDate.setHours(endHour, endMin, 0, 0);
      
      // Calculate duration in seconds
      const duration = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
      
      // Update via API
      await timeEntriesApi.update(entry.id, {
        taskName: editedTaskName,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        duration
      });
      
      setIsEditing(false);
      onUpdate(); // Refresh the list
    } catch (error) {
      console.error('Failed to update entry:', error);
      alert('Помилка при збереженні');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Видалити цей запис?')) return;
  
  try {
    await timeEntriesApi.delete(entry.id); // Wait for deletion to complete
    onDelete(); // Then refresh
  } catch (error) {
    console.error('Failed to delete entry:', error);
    alert('Помилка при видаленні');
  }
};

  const durationValue = isActive 
  ? elapsedSeconds
  : entry.duration !== null 
    ? entry.duration
    : lastStoppedDuration > 0 
      ? lastStoppedDuration 
      : 0;

const displayDuration = 
  isActive 
    ? formatDuration(elapsedSeconds)
    : entry.duration !== null 
      ? formatDuration(entry.duration)
      : entry.endTime !== null && lastStoppedDuration > 0
        ? formatDuration(lastStoppedDuration)
        : formatDuration(0);

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 px-4 py-3 hover:bg-card/50 transition-colors">
      {isEditing ? (
        <div className="col-span-5 grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-center">
          {/* Task name input */}
          <input 
            value={editedTaskName}
            onChange={(e) => setEditedTaskName(e.target.value)}
            className="bg-elevated border border-white/[0.06] rounded px-2 py-1 text-sm text-primary"
            autoFocus
          />
          
          {/* Start time input (HH:MM) */}
          <input 
            type="time"
            value={editedStartTime}
            onChange={(e) => setEditedStartTime(e.target.value)}
            className="bg-elevated border border-white/[0.06] rounded px-2 py-1 text-xs text-secondary w-20"
          />
          
          {/* End time input (HH:MM) */}
          <input 
            type="time"
            value={editedEndTime}
            onChange={(e) => setEditedEndTime(e.target.value)}
            className="bg-elevated border border-white/[0.06] rounded px-2 py-1 text-xs text-secondary w-20"
          />
          
          {/* Save button */}
          <button 
            onClick={handleSave}
            className="bg-amber text-void rounded px-3 py-1 text-xs font-semibold"
          >
            Зберегти
          </button>
          
          {/* Cancel button */}
          <button 
            onClick={() => setIsEditing(false)}
            className="bg-elevated text-secondary rounded px-3 py-1 text-xs"
          >
            Скасувати
          </button>
        </div>
      ) : (
        <>
          {/* Task name */}
          <div className="text-sm text-primary">
            {entry.taskName}
          </div>

          {/* Time range */}
          <div className="text-xs text-dim">
            {formatTimeRange()}
          </div>

          {/* Duration badge */}
          <div className={`font-mono text-sm bg-elevated rounded px-2.5 py-1 ${isActive ? 'text-amber' : 'text-secondary'}`}>
            {displayDuration}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleEditClick}
              className="w-7 h-7 rounded-md bg-elevated text-secondary hover:text-primary hover:bg-card flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={handleDelete}
              className="w-7 h-7 rounded-md bg-rose/10 text-rose hover:bg-rose/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
