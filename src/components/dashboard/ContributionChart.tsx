"use client";

import { useState } from "react";

interface CommitData {
  date: Date;
  count: number;
}

interface ContributionChartProps {
  commitData: CommitData[];
  selectedProject?: {
    id: string;
    name: string;
    owner: string;
    repo: string;
  } | null;
  onShowHelp?: (helpType: string) => void;
}

const colors = ["#ebf6ff", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0369a1"];

export default function ContributionChart({
  commitData,
  selectedProject,
  onShowHelp,
}: ContributionChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col items-center mb-12">
      <div className="relative w-full max-w-7xl">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold gradient-text">
            Contribution Activity
            {selectedProject && (
              <span className="text-lg text-blue-300 ml-3">
                - {selectedProject.name}
              </span>
            )}
          </h2>
          {onShowHelp && (
            <button
              className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              onMouseEnter={() => onShowHelp("commits")}
              onMouseLeave={() => onShowHelp("")}
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Chart Container with liquid glass */}
        <div className="liquid-glass rounded-3xl p-8 transition-all duration-500 hover:liquid-glass-hover">
          {/* Month Labels */}
          <div className="flex pl-12 pr-2 mb-3 text-sm text-white/60 font-medium select-none w-full">
            {(() => {
              // Calculate the week index for each month start
              const year = new Date().getFullYear();
              const weeks: {
                month: string;
                weekIndex: number;
              }[] = [];
              for (let m = 0; m < 12; m++) {
                const firstDayOfMonth = new Date(year, m, 1);
                const startOfYear = new Date(year, 0, 1);
                // Calculate week index (Monday as first day)
                const dayOffset =
                  startOfYear.getDay() === 0 ? 6 : startOfYear.getDay() - 1;
                const daysSinceYearStart = Math.floor(
                  (firstDayOfMonth.getTime() - startOfYear.getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const weekIndex = Math.floor(
                  (daysSinceYearStart + dayOffset) / 7
                );
                weeks.push({
                  month: firstDayOfMonth.toLocaleString("en-US", {
                    month: "short",
                  }),
                  weekIndex,
                });
              }
              // Render month labels with correct spacing
              return weeks.map((w, i) => {
                const nextWeek = weeks[i + 1]?.weekIndex ?? 53;
                const colSpan = nextWeek - w.weekIndex;
                return (
                  <div
                    key={w.month}
                    className="text-center"
                    style={{
                      minWidth: `calc(${colSpan} * 1fr)`,
                      flex: colSpan,
                    }}
                  >
                    {w.month}
                  </div>
                );
              });
            })()}
          </div>
          <div className="flex">
            {/* Weekday Labels */}
            <div className="flex flex-col mr-3 text-sm text-white/60 font-medium select-none">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div
                  key={d}
                  className="h-[24px] flex items-center justify-center"
                  style={{
                    lineHeight: "24px",
                    height: "28px",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Contribution Grid */}
            <div className="flex-1">
              <div
                className="relative grid grid-flow-col gap-[4px] w-full"
                style={{
                  gridTemplateRows: "repeat(7, 1fr)",
                  gridTemplateColumns: "repeat(53, 1fr)",
                  height: "168px",
                }}
              >
                {Array.from({ length: 53 }).map((_, weekIndex) =>
                  Array.from({ length: 7 }).map((_, dayIndex) => {
                    // Calculate the date for this cell
                    const year = new Date().getFullYear();
                    const startOfYear = new Date(year, 0, 1);
                    const dayOffset =
                      startOfYear.getDay() === 0 ? 6 : startOfYear.getDay() - 1;
                    const cellDate = new Date(startOfYear);
                    cellDate.setDate(
                      cellDate.getDate() - dayOffset + weekIndex * 7 + dayIndex
                    );

                    const dayData = commitData.find(
                      (d) =>
                        d.date.getFullYear() === cellDate.getFullYear() &&
                        d.date.getMonth() === cellDate.getMonth() &&
                        d.date.getDate() === cellDate.getDate()
                    );
                    const count = dayData ? dayData.count : 0;

                    return (
                      <div
                        key={weekIndex + "-" + dayIndex}
                        className="rounded-[3px] cursor-pointer relative transition-all duration-200"
                        style={{
                          backgroundColor: colors[Math.min(count, 4)],
                          width: "100%",
                          height: "24px",
                          opacity:
                            hoveredWeek === null
                              ? count === 0
                                ? 0.4
                                : 1
                              : weekIndex === hoveredWeek
                              ? 1
                              : 0.4,
                        }}
                        onMouseEnter={() => {
                          setActiveIndex(weekIndex * 7 + dayIndex);
                          setHoveredWeek(weekIndex);
                        }}
                        onMouseLeave={() => {
                          setActiveIndex(null);
                          setHoveredWeek(null);
                        }}
                      >
                        {activeIndex === weekIndex * 7 + dayIndex && (
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 liquid-glass p-4 rounded-xl text-sm text-white border border-white/20 z-30 min-w-[160px] shadow-2xl">
                            <div className="font-semibold text-lg">
                              {count} commits
                            </div>
                            <div className="text-white/70">
                              {cellDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                {/* Week highlight */}
                {hoveredWeek !== null && (
                  <div
                    className="absolute top-0 pointer-events-none"
                    style={{
                      left: `calc(${hoveredWeek} * (100% / 53))`,
                      width: `calc(100% / 53)`,
                      height: "calc(100% + 24px)",
                      border: "2px solid #38bdf8",
                      borderRadius: "8px",
                      boxShadow: "0 0 16px #38bdf8aa",
                      zIndex: 10,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-3 text-sm mt-8 w-full">
            <span className="text-white/60">Less</span>
            <div className="flex items-center gap-1">
              {colors.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-[3px]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-white/60">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
