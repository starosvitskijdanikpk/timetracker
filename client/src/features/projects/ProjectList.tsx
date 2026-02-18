import { useState } from "react";
import { projectsApi } from "../../services/projectsApi.js";
import { ProjectForm } from "./ProjectForm.js";
import type { Project } from "../../types/index.js";

interface ProjectListProps {
  projects: Project[];
  onUpdate: () => void;
}

export const ProjectList = ({ projects, onUpdate }: ProjectListProps) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей проект?')) return;
    
    try {
      setDeletingId(id);
      await projectsApi.delete(id);
      onUpdate();
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSave = () => {
    setEditingProject(null);
    onUpdate();
  };

  const handleFormCancel = () => {
    setEditingProject(null);
  };

  return (
    <div>
      {/* Edit form overlay */}
      {editingProject && (
        <div className="mb-6">
          <ProjectForm
            project={editingProject}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {/* Projects grid */}
      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group relative bg-card border border-white/[0.06] rounded-xl p-4 hover:shadow-lg transition-all"
          >
            {/* Left accent bar */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
              style={{ backgroundColor: project.color }}
            ></div>

            {/* Project name */}
            <div className="text-sm font-semibold text-primary ml-3">
              {project.name}
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => handleEdit(project)}
                className="w-7 h-7 rounded-md bg-elevated text-secondary hover:text-primary hover:bg-card flex items-center justify-center transition-colors"
                title="Редагувати"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828L8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={() => handleDelete(project.id)}
                disabled={deletingId === project.id}
                className="w-7 h-7 rounded-md bg-rose/10 text-rose hover:bg-rose/20 flex items-center justify-center transition-colors disabled:opacity-50"
                title="Видалити"
              >
                {deletingId === project.id ? (
                  <div className="w-4 h-4 animate-spin rounded border border-rose/20 border-t-transparent"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
