"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  owner: string;
  repo: string;
  isApproved: boolean;
  voteCount: number;
  votes: Array<{
    id: string;
    user: {
      name: string | null;
      image: string | null;
    };
  }>;
  projectAssignments: Array<{
    id: string;
    user: {
      name: string | null;
      image: string | null;
    };
  }>;
  _count: {
    votes: number;
    projectAssignments: number;
  };
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSelect?: (project: Project) => void;
}

export default function ProjectModal({
  isOpen,
  onClose,
  onProjectSelect,
}: ProjectModalProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"discover" | "submit">("discover");
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "approved" | "pending"
  >("all");

  // Submit form state
  const [submitForm, setSubmitForm] = useState({
    name: "",
    description: "",
    githubUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/projects?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Fetch user's assigned projects
  const fetchUserProjects = async () => {
    try {
      const response = await fetch("/api/projects/user");
      if (response.ok) {
        const data = await response.json();
        setUserProjects(data);
      }
    } catch (error) {
      console.error("Error fetching user projects:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      fetchUserProjects();
    }
  }, [isOpen, fetchProjects]);

  // Handle project submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitForm),
      });

      if (response.ok) {
        setSubmitForm({ name: "", description: "", githubUrl: "" });
        setActiveTab("discover");
        fetchProjects(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit project");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Failed to submit project");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle voting
  const handleVote = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/vote`, {
        method: "POST",
      });

      if (response.ok) {
        fetchProjects(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || "Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote");
    }
  };

  // Handle assignment
  const handleAssign = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/assign`, {
        method: "POST",
      });

      if (response.ok) {
        fetchUserProjects(); // Refresh user projects
        fetchProjects(); // Refresh all projects
        alert("Successfully assigned to project!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to assign to project");
      }
    } catch (error) {
      console.error("Error assigning to project:", error);
      alert("Failed to assign to project");
    }
  };

  // Check if user has voted for a project
  const hasUserVoted = (project: Project) => {
    return project.votes.some((vote) => vote.user.name === session?.user?.name);
  };

  // Check if user is assigned to a project
  const isUserAssigned = (project: Project) => {
    return project.projectAssignments.some(
      (assignment) => assignment.user.name === session?.user?.name
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="liquid-glass border border-white/20 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">
            Project Management
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "discover"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            Discover Projects
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "submit"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            Submit Project
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {activeTab === "discover" && (
            <div>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50"
                />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "all" | "approved" | "pending"
                    )
                  }
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="all">All Projects</option>
                  <option value="approved">Approved Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>

              {/* My Projects Section */}
              {userProjects.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">
                    My Assigned Projects
                  </h3>
                  <div className="grid gap-4">
                    {userProjects.map((project) => (
                      <div
                        key={project.id}
                        className="glass-card p-6 rounded-xl border border-white/10 hover:glass-card-hover transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-white">
                                {project.name}
                              </h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  project.isApproved
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                    : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                }`}
                              >
                                {project.isApproved ? "Approved" : "Pending"}
                              </span>
                            </div>
                            <p className="text-white/70 mb-3">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <span>
                                👥 {project._count.projectAssignments} assigned
                              </span>
                              <span>👍 {project._count.votes} votes</span>
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                {project.owner}/{project.repo}
                              </a>
                            </div>
                          </div>
                          <button
                            onClick={() => onProjectSelect?.(project)}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            View Contributions
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Projects */}
              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-4">
                  {statusFilter === "all"
                    ? "All Projects"
                    : statusFilter === "approved"
                    ? "Approved Projects"
                    : "Pending Projects"}
                </h3>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="glass-card p-6 rounded-xl border border-white/10 hover:glass-card-hover transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-white">
                                {project.name}
                              </h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  project.isApproved
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                    : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                }`}
                              >
                                {project.isApproved ? "Approved" : "Pending"}
                              </span>
                            </div>
                            <p className="text-white/70 mb-3">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <span>
                                👥 {project._count.projectAssignments} assigned
                              </span>
                              <span>👍 {project._count.votes} votes</span>
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                {project.owner}/{project.repo}
                              </a>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!hasUserVoted(project) && !project.isApproved && (
                              <button
                                onClick={() => handleVote(project.id)}
                                className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all duration-300"
                              >
                                Vote
                              </button>
                            )}
                            {project.isApproved && !isUserAssigned(project) && (
                              <button
                                onClick={() => handleAssign(project.id)}
                                className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
                              >
                                Join
                              </button>
                            )}
                            {isUserAssigned(project) && (
                              <button
                                onClick={() => onProjectSelect?.(project)}
                                className="btn-primary px-4 py-2 text-sm"
                              >
                                View Contributions
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "submit" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/80 font-medium mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={submitForm.name}
                  onChange={(e) =>
                    setSubmitForm({ ...submitForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={submitForm.description}
                  onChange={(e) =>
                    setSubmitForm({
                      ...submitForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 h-24 resize-none"
                  placeholder="Describe the project and its goals"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-2">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={submitForm.githubUrl}
                  onChange={(e) =>
                    setSubmitForm({ ...submitForm, githubUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50"
                  placeholder="https://github.com/owner/repo"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {submitting ? "Submitting..." : "Submit Project"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
