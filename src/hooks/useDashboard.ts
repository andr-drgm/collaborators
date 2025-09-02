"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { signOut } from "next-auth/react";
import {
  Project,
  CommitData,
  fetchUserProjects,
  fetchCommitsData,
} from "@/utils/dashboardUtils";

export function useDashboard() {
  const [loading, setLoading] = useState(false);
  const [commitData, setCommitData] = useState<CommitData[]>([]);
  const [totalCommits, setTotalCommits] = useState(0);
  const [tokensHeld, setTokensHeld] = useState(0);
  const [tokensClaimed, setTokensClaimed] = useState(0);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [showHelp, setShowHelp] = useState<string | null>(null);

  const { data: session, status: sessionStatus } = useSession();
  const { disconnect } = useWallet();
  const navigate = useRouter();

  // Fetch user projects
  useEffect(() => {
    const loadUserProjects = async () => {
      try {
        const projects = await fetchUserProjects();
        setUserProjects(projects);

        // Auto-select the first project if user has projects but none selected
        if (projects.length > 0 && !selectedProject) {
          setSelectedProject(projects[0]);
        }
      } catch (error) {
        console.error("Error loading user projects:", error);
      }
    };

    if (sessionStatus === "authenticated") {
      loadUserProjects();
    }
  }, [sessionStatus, selectedProject]);

  // Fetch GitHub commits data
  useEffect(() => {
    const loadCommitsData = async () => {
      try {
        setLoading(true);
        const data = await fetchCommitsData(selectedProject);
        setCommitData(data.commitData);
        setTotalCommits(data.totalCommits);
        setTokensHeld(data.tokensHeld);
      } catch (error) {
        console.error("Error loading commits data:", error);
        setCommitData([]);
        setTotalCommits(0);
        setTokensHeld(0);
      } finally {
        setLoading(false);
      }
    };

    if (sessionStatus === "authenticated") {
      loadCommitsData();
    }
  }, [sessionStatus, selectedProject]);

  // Handle session loading state
  useEffect(() => {
    if (sessionStatus === "loading") setLoading(true);
    else if (sessionStatus === "unauthenticated") {
      setLoading(false);
      navigate.push("/");
    }
  }, [sessionStatus, navigate]);

  const handleLogout = () => {
    disconnect();
    signOut({ redirectTo: "/" });
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowProjectModal(false);
  };

  const handleTokensClaimed = (amount: number) => {
    setTokensClaimed((prev) => prev + amount);
    setTokensHeld(0);
  };

  const handleShowHelp = (helpType: string) => {
    if (helpType === "") {
      setShowHelp(null);
    } else {
      setShowHelp(helpType);
    }
  };

  const handleCloseHelp = () => {
    setShowHelp(null);
  };

  return {
    // State
    loading,
    commitData,
    totalCommits,
    tokensHeld,
    tokensClaimed,
    showProjectModal,
    selectedProject,
    userProjects,
    showHelp,
    session,

    // Actions
    setShowProjectModal,
    handleLogout,
    handleProjectSelect,
    handleTokensClaimed,
    handleShowHelp,
    handleCloseHelp,
  };
}
