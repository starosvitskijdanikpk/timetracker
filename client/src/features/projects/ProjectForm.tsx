import { useState } from "react";
import { projectsApi } from "../../services/projectsApi.js";
import type { Project } from "../../types/index.js";

interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

const colorSwatches = [
  "#2dd4bf", "#f5a623", "#818cf8", "#f43f5e", 
  "#34d399", "#fb923c", "#60a5fa", "#e879f9"
];

export const ProjectForm = ({ project, onSave, onCancel }: ProjectFormProps) => {
  const [name, setName] = useState(project?.name || "");
  const [color, setColor] = useState(project?.color || colorSwatches[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    try {
      if (project) {
        await projectsApi.update(project.id, { name: name.trim(), color });
      } else {
        await projectsApi.create({ name: name.trim(), color });
      }
      onSave();
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-white/[0.06] p-5">
      <div className="mb-4">
        <label className="block text-sm font-medium text-primary mb-2">
          Назва проекту
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-elevated border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-primary w-full focus:outline-none focus:ring-2 focus:ring-amber/50"
          placeholder="Введіть назву..."
          autoFocus
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-primary mb-3">
          Колір
        </label>
        <div className="flex gap-3 flex-wrap">
          {colorSwatches.map((swatchColor) => (
            <button
              key={swatchColor}
              type="button"
              onClick={() => setColor(swatchColor)}
              className={`w-6 h-6 rounded-full transition-all ${
                color === swatchColor 
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-void scale-110' 
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: swatchColor }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-amber text-void font-bold rounded-lg px-4 py-2 text-sm hover:bg-amber/90 transition-colors"
        >
          {project ? 'Зберегти' : 'Створити'}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="bg-elevated text-secondary rounded-lg px-4 py-2 text-sm hover:text-primary hover:bg-card transition-colors"
        >
          Скасувати
        </button>
      </div>
    </form>
  );
};
