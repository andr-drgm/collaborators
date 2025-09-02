"use client";

import ProfileCard from "@/components/dashboard/ProfileCard";
import WalletConnect from "@/components/dashboard/WalletConnect";
import ContributionChart from "@/components/dashboard/ContributionChart";
import StatsCards from "@/components/dashboard/StatsCards";
import HelpModal from "@/components/dashboard/HelpModal";
import ProjectSelector from "@/components/dashboard/ProjectSelector";
import LoadingOverlay from "@/components/dashboard/LoadingOverlay";
import OnboardingBanner from "@/components/dashboard/OnboardingBanner";
import NoProjectsMessage from "@/components/dashboard/NoProjectsMessage";
import ProjectModal from "@/components/ProjectModal";
import { useDashboard } from "@/hooks/useDashboard";
import { formatMemberSince } from "@/utils/dashboardUtils";

export default function Dashboard() {
  const {
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
  } = useDashboard();

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <button
              className="btn-secondary px-4 py-2 text-sm"
              onClick={handleLogout}
            >
              &larr; Log Out
            </button>
            <h1 className="text-5xl font-bold gradient-text">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProjectModal(true)}
              className="btn-primary px-6 py-3 text-sm font-semibold"
            >
              Manage Projects
            </button>
            <WalletConnect />
          </div>
        </div>

        {/* Onboarding Banner */}
        <OnboardingBanner onShowHelp={handleShowHelp} />

        {/* Profile Card */}
        <ProfileCard
          imageUrl={session?.user?.image}
          name={session?.user?.name}
          username={session?.user.tokens.toString()}
          memberSince={formatMemberSince(session?.user?.createdAt?.toString())}
          className="mb-12"
        />

        {/* Loading Overlay */}
        <LoadingOverlay isLoading={loading} />

        {/* Project Selector */}
        <ProjectSelector
          userProjects={userProjects}
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
        />

        {/* Chart Section - Only show if user has assigned projects */}
        {userProjects.length > 0 && (
          <ContributionChart
            commitData={commitData}
            selectedProject={selectedProject}
            onShowHelp={handleShowHelp}
          />
        )}

        {/* No Projects Message */}
        {userProjects.length === 0 && (
          <NoProjectsMessage
            onShowProjectModal={() => setShowProjectModal(true)}
          />
        )}

        {/* Stats Section */}
        <StatsCards
          totalCommits={totalCommits}
          tokensHeld={tokensHeld}
          tokensClaimed={tokensClaimed}
          onTokensClaimed={handleTokensClaimed}
          onShowHelp={handleShowHelp}
        />

        {/* Help Modal */}
        <HelpModal
          isOpen={!!showHelp}
          helpType={showHelp}
          onClose={handleCloseHelp}
        />

        {/* Project Modal */}
        <ProjectModal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          onProjectSelect={handleProjectSelect}
        />
      </div>
    </div>
  );
}
