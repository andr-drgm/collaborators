"use client";

interface Project {
  id: string;
  name: string;
  owner: string;
  repo: string;
}

interface ProjectSelectorProps {
  userProjects: Project[];
  selectedProject: Project | null;
  onProjectSelect: (project: Project) => void;
}

export default function ProjectSelector({
  userProjects,
  selectedProject,
  onProjectSelect,
}: ProjectSelectorProps) {
  if (userProjects.length === 0) return null;

  return (
    <div className="w-full flex justify-center mb-8">
      <div className="liquid-glass p-6 rounded-2xl border border-white/10 max-w-2xl w-full">
        <div className="flex items-center gap-4">
          <label className="text-white/80 font-medium">Current Project:</label>
          <select
            value={selectedProject?.id || ""}
            onChange={(e) => {
              const project = userProjects.find((p) => p.id === e.target.value);
              if (project) {
                onProjectSelect(project);
              }
            }}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
          >
            {userProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.owner}/{project.repo})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
