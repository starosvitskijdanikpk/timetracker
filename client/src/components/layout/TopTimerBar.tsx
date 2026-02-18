import { useTimerStore } from "../../store/timerStore.js";
import { useActiveTimer } from "../../hooks/useActiveTimer.js";
import { TimerDisplay } from "../ui/TimerDisplay.js";
import { timeEntriesApi } from "../../services/timeEntriesApi.js";

interface TopTimerBarProps {
  // onTimerStopped prop removed - using custom event instead
}

export function TopTimerBar() {
  const { activeEntry, elapsedSeconds, setActiveEntry, preserveDuration } = useTimerStore();
  
  // Initialize timer on mount
  useActiveTimer();

  const handleStop = async () => {
    if (!activeEntry) return;
    
    preserveDuration();
    setActiveEntry(null);
    
    await timeEntriesApi.stop(activeEntry.id);
    
    // Dispatch a custom event that TrackerPage can listen to
    window.dispatchEvent(new CustomEvent('timer-stopped'));
  };

  if (!activeEntry) {
    return (
      <div className="sticky top-0 z-50 bg-void/85 backdrop-blur-xl border-b border-white/[0.06] px-8 py-3.5 flex items-center gap-5">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="relative w-2 h-2 bg-dim rounded-full"></span>
          </div>
          <span className="text-sm font-medium text-dim">Неактивно</span>
        </div>

        {/* Task name placeholder */}
        <div className="flex-1 text-sm font-medium text-dim">
          {/* Empty space to maintain layout */}
        </div>

        {/* Project chip placeholder */}
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 bg-void/85 backdrop-blur-xl border-b border-white/[0.06] px-8 py-3.5 flex items-center gap-0">
      {/* Status with pulsing dot */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={`w-2 h-2 rounded-full ${activeEntry ? 'bg-amber' : 'bg-text-dim'}`}>
            {activeEntry && (
              <span className="absolute inset-0 rounded-full border-2 border-amber animate-ping"></span>
            )}
          </div>
        </div>
        <span className={`text-xs font-normal ${activeEntry ? 'text-secondary' : 'text-dim'}`}>
          {activeEntry ? 'Активно' : 'Неактивно'}
        </span>
      </div>

      {/* Task name - only when active */}
      {activeEntry && (
        <div className="flex-1 ml-4 text-sm font-medium text-primary truncate">
          {activeEntry.taskName}
        </div>
      )}

      {/* Project chip - only when active and has project */}
      {activeEntry?.project && (
        <div className="flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-medium ml-3"
          style={{ 
            borderColor: `${activeEntry.project.color}30`,
            color: activeEntry.project.color 
          }}
        >
          <div 
            className="w-1.5 h-1.5 rounded-full" 
            style={{ backgroundColor: activeEntry.project.color }}
          />
          {activeEntry.project.name}
        </div>
      )}

      {/* Timer display */}
      <div className="ml-4 font-mono text-xl font-bold tracking-wide text-amber">
        <TimerDisplay seconds={activeEntry ? elapsedSeconds : 0} />
      </div>

      {/* Stop button - only when active */}
      {activeEntry && (
        <button 
          onClick={handleStop}
          className="ml-4 flex items-center gap-2 bg-rose/10 border border-rose/30 text-rose rounded-lg px-4 py-2 text-sm font-semibold hover:bg-rose/20 transition"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect width="12" height="12" rx="2"/>
          </svg>
          Зупинити
        </button>
      )}
    </div>
  );
};
