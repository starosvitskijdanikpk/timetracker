import { useState } from "react";
import { ProjectList } from "../features/projects/ProjectList.js";
import { ProjectForm } from "../features/projects/ProjectForm.js";
import { useProjects } from "../hooks/useProjects.js";

export const ProjectsPage = () => {
  const { projects, isLoading, refetch } = useProjects();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleProjectUpdate = () => {
    refetch();
  };

  const handleAddProject = () => {
    setShowAddForm(true);
  };

  const handleFormSave = () => {
    setShowAddForm(false);
    handleProjectUpdate();
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="text-center text-secondary">
          Завантаження...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold text-primary">
          Проекти
        </h1>
        
        <button
          onClick={handleAddProject}
          className="bg-amber text-void font-bold rounded-lg px-4 py-2 text-sm hover:bg-amber/90 transition-colors"
        >
          Додати проект
        </button>
      </div>

      {/* Add project form */}
      {showAddForm && (
        <ProjectForm
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {/* Projects list */}
      <ProjectList
        projects={projects}
        onUpdate={handleProjectUpdate}
      />

      {/* Empty state */}
      {projects.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="text-secondary mb-2">
            Немає проектів
          </div>
          <div className="text-dim text-sm">
            Створіть свій перший проект для відстежування часу
          </div>
        </div>
      )}
    </div>
  );
};
