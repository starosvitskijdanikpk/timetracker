import { useState } from "react";
import { timeEntriesApi } from "../../services/timeEntriesApi.js";
import { useProjects } from "../../hooks/useProjects.js";
import { useTimerStore } from "../../store/timerStore.js";
import { AutocompleteInput } from "./AutocompleteInput.js";

interface TaskInputFormProps {
  onEntryStarted: () => void;
}

export const TaskInputForm = ({ onEntryStarted }: TaskInputFormProps) => {
  const [taskName, setTaskName] = useState("");
  const [projectId, setProjectId] = useState("");
  const { projects } = useProjects();
  const setActiveEntry = useTimerStore((state) => state.setActiveEntry);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) return;

    try {
      await timeEntriesApi.start({
        taskName: taskName.trim(),
        projectId: projectId || undefined,
      });
      
      // Fetch active entry with project included
      const activeResponse = await timeEntriesApi.getActive();
      setActiveEntry(activeResponse);
      
      setTaskName("");
      setProjectId("");
      onEntryStarted(); // Refresh the entry list
    } catch (error) {
      console.error("Failed to start time entry:", error);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-white/[0.06] p-5 relative mb-8">
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent"></div>
      
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1">
          <AutocompleteInput value={taskName} onChange={setTaskName} />
        </div>
        
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="bg-elevated border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-secondary appearance-none min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber/50"
        >
          <option value="">Без проекту</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        
        <button
          type="submit"
          className="bg-amber text-void font-bold rounded-lg px-5 py-2.5 text-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(245,166,35,0.3)] hover:shadow-[0_6px_25px_rgba(245,166,35,0.4)] transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Почати
        </button>
      </form>
    </div>
  );
};
