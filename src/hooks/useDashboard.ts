"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivyAuth } from "./usePrivyAuth";
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

  const {
    ready,
    authenticated,
    userData,
    logout: privyLogout,
    getAccessToken,
  } = usePrivyAuth();
  const navigate = useRouter();

  // Fetch user projects
  useEffect(() => {
    const loadUserProjects = async () => {
      try {
        const accessToken = await getAccessToken();
        const projects = await fetchUserProjects(accessToken ?? undefined);
        setUserProjects(projects);

        // Auto-select the first project if user has projects but none selected
        if (projects.length > 0 && !selectedProject) {
          setSelectedProject(projects[0]);
        }
      } catch (error) {
        console.error("Error loading user projects:", error);
      }
    };

    if (authenticated && ready) {
      loadUserProjects();
    }
  }, [authenticated, ready, selectedProject, getAccessToken]);

  // Fetch GitHub commits data
  useEffect(() => {
    const loadCommitsData = async () => {
      try {
        setLoading(true);
        const accessToken = await getAccessToken();
        const data = await fetchCommitsData(
          selectedProject,
          accessToken ?? undefined
        );
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

    if (authenticated && ready) {
      loadCommitsData();
    }
  }, [authenticated, ready, selectedProject, getAccessToken]);

  // Handle auth loading state
  useEffect(() => {
    if (!ready) {
      setLoading(true);
    } else if (!authenticated) {
      setLoading(false);
      navigate.push("/");
    } else {
      setLoading(false);
    }
  }, [ready, authenticated, navigate]);

  const handleLogout = async () => {
    await privyLogout();
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
    session: userData
      ? {
          user: {
            name: userData.name,
            email: userData.email,
            image: userData.image,
            tokens: userData.unclaimedTokens || 0,
            createdAt: userData.createdAt,
            login: userData.username,
            username: userData.username,
          },
        }
      : null,

    // Actions
    setShowProjectModal,
    handleLogout,
    handleProjectSelect,
    handleTokensClaimed,
    handleShowHelp,
    handleCloseHelp,
  };
}
