"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  TYPE_CONFIG,
  LANES,
  FILTER_PRESETS,
  PRIORITY_VISUAL,
  PRIORITY_CONFIG_RU,
  INITIAL_MISSIONS,
} from "../features/missions/constants";
import { classNames } from "../shared/ui";
import { MissionsHeader } from "../features/missions/ui/MissionsHeader";
import { MissionsList } from "../features/missions/ui/MissionsList";
import { CreateMissionBar } from "../features/missions/ui/CreateMissionBar";
import { RequireAuth } from "../shared/auth/RequireAuth";
import { RequireOnboarding } from "../shared/auth/RequireOnboarding";
import {
  loadProjectsFromLocalStorage,
  saveProjectsToLocalStorage,
  getAccessibleProjects,
  createProject,
  addMemberToProject,
  updateProjectMissions,
  updateProjectTitle,
  removeMemberFromProject,
} from "../features/projects/localRepository";
import { deriveHandleFromSession } from "../features/projects/utils";
import { MissionTypeIcon } from "../features/missions/ui/MissionTypeIcon";
import Image from "next/image";

/* ────────────────────────────────────────────────────────── */
/* Inline type shape (matches Figma exactly)                  */
/* feature = violet square, research = blue circle,           */
/* task = green triangle                                       */
/* ────────────────────────────────────────────────────────── */
function TypeShapeInline({ type }) {
  if (type === "feature") {
    return (
      <span
        className="inline-block flex-shrink-0"
        style={{ width: 9, height: 9, background: "#8b5cf6", borderRadius: 2 }}
      />
    );
  }
  if (type === "research") {
    return (
      <span
        className="inline-block flex-shrink-0 rounded-full"
        style={{ width: 9, height: 9, background: "#38bdf8" }}
      />
    );
  }
  if (type === "task") {
    return (
      <span
        className="inline-block flex-shrink-0"
        style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderBottom: "9px solid #22c55e",
        }}
      />
    );
  }
  return null;
}

/* ────────────────────────────────────────────────────────── */
/* Type filter chips                                          */
/* ────────────────────────────────────────────────────────── */
function TypeChips({ selectedTypes, onToggleType }) {
  const chips = [
    { key: "feature", label: "Feature" },
    { key: "research", label: "Research" },
    { key: "task", label: "Task" },
  ];
  const anyActive = Object.values(selectedTypes).some(Boolean);

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
      <button
        type="button"
        onClick={() => {
          if (anyActive) {
            Object.keys(selectedTypes).forEach((k) => {
              if (selectedTypes[k]) onToggleType(k);
            });
          }
        }}
        className={classNames(
          "inline-flex flex-shrink-0 items-center rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors",
          !anyActive
            ? "bg-white/15 text-white"
            : "bg-white/[0.06] text-zinc-400 hover:bg-white/10",
        )}
      >
        All
      </button>
      {chips.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onToggleType(key)}
          className={classNames(
            "inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
            selectedTypes[key]
              ? "bg-white/15 text-white"
              : "bg-white/[0.06] text-zinc-400 hover:bg-white/10",
          )}
        >
          <TypeShapeInline type={key} />
          {label}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Bottom sheet wrapper                                        */
/* ────────────────────────────────────────────────────────── */
function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-[#1b1e23] ring-1 ring-white/[0.06] lg:left-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-[400px] lg:rounded-none lg:max-h-none">
        <div className="flex justify-center pt-3 pb-1 lg:hidden">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
          <span className="text-[15px] font-semibold text-zinc-100">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-zinc-400 hover:bg-white/15 text-sm"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Full-screen mission detail overlay                          */
/* ────────────────────────────────────────────────────────── */
function MissionDetailPage({ mission, allAssignees, onChangeField, onSave, onClose }) {
  if (!mission) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131618] overflow-y-auto">
      {/* Max-width wrapper to match mobile-first layout on desktop */}
      <div className="mx-auto w-full max-w-lg h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] sticky top-0 bg-[#131618] z-10">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors text-zinc-400"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2 className="text-[15px] font-semibold text-zinc-100 flex-1 truncate">
            {mission.title}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-5 space-y-5 overflow-y-auto">
          {/* Mission title */}
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Миссия</p>
            <div className="flex items-center gap-2 rounded-[4] bg-[#1b1e23] px-4 py-3 ring-1 ring-white/[0.06]">
              <input
                type="text"
                value={mission.title}
                onChange={(e) => onChangeField("title", e.target.value)}
                className="flex-1 bg-transparent text-[14px] text-zinc-100 focus:outline-none"
              />
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="#71717a" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Type */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Тип</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onChangeField("type", key)}
                  className={classNames(
                    "inline-flex items-center gap-1.5 rounded-[4] px-3 py-1.5 text-[12px] font-medium ring-1 transition-colors",
                    mission.type === key
                      ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                      : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
                  )}
                >
                  <MissionTypeIcon type={mission.type} />
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Приоритет</p>
            <div className="flex flex-wrap gap-2">
              {["lowest", "low", "medium", "high", "highest"].map((key) => {
                const visual = PRIORITY_VISUAL[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onChangeField("priority", key)}
                    className={classNames(
                      "inline-flex items-center gap-1 rounded-[4] px-3 py-1.5 text-[12px] font-medium ring-1 transition-colors",
                      mission.priority === key
                        ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                        : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
                    )}
                  >
                    <Image 
                      className={classNames("text-[10px]", visual?.color)} 
                      src={visual?.icon} 
                      width={18} 
                      height={18}
                      alt=""
                    />
                    {PRIORITY_CONFIG_RU[key]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status / Lane */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Статус</p>
            <div className="flex flex-wrap gap-2">
              {LANES.map((lane) => (
                <button
                  key={lane}
                  type="button"
                  onClick={() => onChangeField("lane", lane)}
                  className={classNames(
                    "rounded-[4] px-3 py-1.5 text-[12px] font-medium ring-1 transition-colors",
                    mission.lane === lane
                      ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                      : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
                  )}
                >
                  {lane}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Дата</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 text-[11px] font-medium text-zinc-500">Date</p>
                <input
                  type="date"
                  value={mission.date}
                  onChange={(e) => onChangeField("date", e.target.value)}
                  className="w-full rounded-[4] bg-[#1b1e23] px-3 py-2.5 text-[13px] text-zinc-200 ring-1 ring-white/[0.06] focus:outline-none focus:ring-[#3B7FFF]"
                />
              </div>
              <div>
                <p className="mb-1 text-[11px] font-medium text-zinc-500">Time</p>
                <input
                  type="time"
                  value={mission.time}
                  onChange={(e) => onChangeField("time", e.target.value)}
                  className="w-full rounded-[4] bg-[#1b1e23] px-3 py-2.5 text-[13px] text-zinc-200 ring-1 ring-white/[0.06] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Assignee */}
          {allAssignees.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Ответственный</p>
              <div className="flex flex-wrap gap-2">
                {allAssignees.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onChangeField("assignee", name)}
                    className={classNames(
                      "inline-flex items-center gap-1.5 rounded-[4] px-3 py-1.5 text-[12px] font-medium ring-1 transition-colors",
                      mission.assignee === name
                        ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                        : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
                    )}
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-[9px] font-bold text-white">
                      {name.replace("@", "").slice(0, 2).toUpperCase()}
                    </span>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save button — sticky bottom */}
        <div className="sticky bottom-0 px-4 py-4 bg-[#131618] border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onSave}
            className="w-full rounded-[4] bg-[#3774E8] py-3.5 text-[14px] ring-1 ring-[#3B7FFF] font-semibold text-w transition-colors active:scale-[0.98]"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Filters panel content                                      */
/* ────────────────────────────────────────────────────────── */
function FiltersPanelContent({
  onAddUser,
  filterPreset,
  onApplyPreset,
  filterName,
  setFilterName,
  selectedTypes,
  onToggleType,
  laneFilter,
  setLaneFilter,
  filterPriority,
  setFilterPriority,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  allAssignees,
  selectedAssignees,
  onToggleAssignee,
  onToggleAssigneesAll,
  onlyMyMissions,
  setOnlyMyMissions,
  onReset,
  onSave,
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Стандартные фильтры</p>
        <div className="flex flex-wrap gap-2">
          {FILTER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={classNames(
                "rounded-[4] px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                filterPreset === preset.id
                  ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                  : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Тип</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_CONFIG).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => onToggleType(key)}
              className={classNames(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                selectedTypes[key]
                  ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                  : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
              )}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Статус</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLaneFilter("All Mission")}
            className={classNames(
              "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
              laneFilter === "All Mission"
                ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
            )}
          >
            All
          </button>
          {LANES.map((lane) => (
            <button
              key={lane}
              type="button"
              onClick={() => setLaneFilter(lane)}
              className={classNames(
                "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                laneFilter === lane
                  ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                  : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
              )}
            >
              {lane}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Приоритет</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterPriority("all")}
            className={classNames(
              "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
              filterPriority === "all"
                ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
            )}
          >
            All
          </button>
          {["lowest", "low", "medium", "high", "highest"].map((key) => {
            const visual = PRIORITY_VISUAL[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilterPriority(key)}
                className={classNames(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                  filterPriority === key
                    ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                    : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
                )}
              >
                <Image 
                  className={classNames("text-[10px]", visual?.color)} 
                  src={visual?.icon} 
                  width={18} 
                  height={18}
                  alt=""
                />
                {PRIORITY_CONFIG_RU[key]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-[11px] font-medium text-zinc-400">От</p>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-xl bg-white/[0.05] px-3 py-2 text-[12px] text-zinc-200 ring-1 ring-white/10 focus:outline-none focus:ring-[#3B7FFF]"
          />
        </div>
        <div>
          <p className="mb-1 text-[11px] font-medium text-zinc-400">До</p>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-xl bg-white/[0.05] px-3 py-2 text-[12px] text-zinc-200 ring-1 ring-white/10 focus:outline-none focus:ring-[#3B7FFF]"
          />
        </div>
      </div>

      {allAssignees.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Ответственный</p>
            <button
              type="button"
              onClick={onToggleAssigneesAll}
              className="text-[11px] font-medium text-w hover:text-w"
            >
              {selectedAssignees.length ? "Reset" : "All"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allAssignees.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => onToggleAssignee(name)}
                className={classNames(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                  selectedAssignees.includes(name)
                    ? "bg-[#3774e875] ring-[#3B7FFF] text-w"
                    : "bg-white/[0.05] ring-white/10 text-zinc-300 hover:ring-white/20",
                )}
              >
                <span className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-[9px] font-bold text-white">
                  {name.replace("@", "").slice(0, 2).toUpperCase()}
                </span>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[12px] text-zinc-300">Только мои миссии</span>
        <button
          type="button"
          role="switch"
          aria-checked={onlyMyMissions}
          onClick={() => setOnlyMyMissions((v) => !v)}
          className={classNames(
            "relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors",
            onlyMyMissions ? "bg-[#3B7FFF]" : "bg-white/15",
          )}
        >
          <span
            className={classNames(
              "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
              onlyMyMissions ? "translate-x-5" : "translate-x-1",
            )}
          />
        </button>
      </div>

      {onAddUser && (
        <button
          type="button"
          onClick={onAddUser}
          className="w-full rounded-xl bg-white/[0.05] py-2.5 text-[12px] font-medium text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
        >
          + Добавить пользователя
        </button>
      )}

      <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-xl bg-white/[0.05] py-2.5 text-[12px] font-medium text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
        >
          Сбросить
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex-1 rounded-xl bg-[#3B7FFF] py-2.5 text-[12px] font-semibold text-w hover:bg-emerald-400 transition-colors"
        >
          Принять
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Project menu / switcher                                    */
/* ────────────────────────────────────────────────────────── */
function ProjectMenu({
  open,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onLeaveProject,
  onRenameProject,
  onAddUser,
  currentUserId,
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const currentProject = projects.find((p) => p.id === currentProjectId);

  return (
    <BottomSheet open={open} onClose={onClose} title="Project">
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Product name</p>
          {editingTitle ? (
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onRenameProject(currentProjectId, draftTitle);
                    setEditingTitle(false);
                  }
                  if (e.key === "Escape") setEditingTitle(false);
                }}
                className="flex-1 rounded-xl bg-white/[0.05] px-3 py-2 text-[13px] text-zinc-100 ring-1 ring-white/10 focus:outline-none focus:ring-emerald-500/60"
              />
              <button
                type="button"
                onClick={() => {
                  onRenameProject(currentProjectId, draftTitle);
                  setEditingTitle(false);
                }}
                className="rounded-xl bg-emerald-500 px-3 py-2 text-[12px] font-semibold text-black"
              >
                OK
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraftTitle(currentProject?.title || "");
                setEditingTitle(true);
              }}
              className="w-full rounded-xl bg-white/[0.05] px-3 py-2.5 text-left text-[13px] text-zinc-100 ring-1 ring-white/10 hover:ring-white/20"
            >
              {currentProject?.title || "Untitled"}
              <span className="ml-2 text-[11px] text-zinc-500">· tap to rename</span>
            </button>
          )}
        </div>

        {currentProject?.members?.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Members</p>
            <div className="flex flex-wrap gap-2">
              {currentProject.members.map((m, i) => {
                const colors = ["from-sky-500 to-violet-500", "from-fuchsia-500 to-amber-400", "from-emerald-500 to-lime-400"];
                return (
                  <div key={m?.userId || i} className="flex items-center gap-1.5">
                    <span className={classNames("inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white bg-gradient-to-tr", colors[i % colors.length])}>
                      {(m?.handle || m?.name || "U").replace("@", "").slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-[12px] text-zinc-300">{m?.handle || m?.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {projects.length > 1 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Switch product</p>
            <div className="space-y-1">
              {projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectProject(p.id);
                    onClose();
                  }}
                  className={classNames(
                    "w-full rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors",
                    p.id === currentProjectId
                      ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
                      : "bg-white/[0.05] text-zinc-300 hover:bg-white/10",
                  )}
                >
                  {p.title || "Untitled"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={() => { onAddUser(); onClose(); }}
            className="w-full rounded-xl bg-white/[0.05] py-2.5 text-[12px] font-medium text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
          >
            + Add member
          </button>
          <button
            type="button"
            onClick={() => { onCreateProject(); onClose(); }}
            className="w-full rounded-xl bg-white/[0.05] py-2.5 text-[12px] font-medium text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
          >
            + New product
          </button>
          <button
            type="button"
            onClick={() => { onLeaveProject(); onClose(); }}
            className="w-full rounded-xl bg-rose-500/10 py-2.5 text-[12px] font-medium text-rose-400 ring-1 ring-rose-500/30 hover:bg-rose-500/20 transition-colors"
          >
            {currentProject?.members?.length <= 1 ? "Delete product" : "Leave product"}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Empty state                                                */
/* ────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-16 text-center px-6">
      {/* Mascot */}
      <div className="mb-6">
        <div className="flex gap-6 mb-3 justify-center">
          <div className="w-7 h-7 rounded-full border-2 border-zinc-600" />
          <div className="w-7 h-7 rounded-full border-2 border-zinc-600" />
        </div>
        <div
          className="w-12 h-6 mx-auto"
          style={{
            borderBottom: "2px solid #52525b",
            borderLeft: "2px solid #52525b",
            borderRight: "2px solid #52525b",
            borderRadius: "0 0 9999px 9999px",
          }}
        />
      </div>
      <p className="text-[22px] font-bold text-white mb-2">Add the first mission</p>
      <p className="text-[14px] text-zinc-500">Select the type, and enter it</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Main page                                                  */
/* ────────────────────────────────────────────────────────── */
export default function Home() {
  const { data: session, status } = useSession();

  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [onboardingDisplayName, setOnboardingDisplayName] = useState(null);

  const currentProject = useMemo(
    () => projects.find((p) => p.id === currentProjectId) || null,
    [projects, currentProjectId],
  );

  const [missions, setMissions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({ feature: false, research: false, task: false });
  const [filterPreset, setFilterPreset] = useState(null);
  const [filterName, setFilterName] = useState("Untitled-1");
  const [filterPriority, setFilterPriority] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [onlyMyMissions, setOnlyMyMissions] = useState(false);
  const [laneFilter, setLaneFilter] = useState("All Mission");
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [editingMission, setEditingMission] = useState(null);

  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  const projectMembers = currentProject?.members || [];
  const allAssignees = useMemo(
    () => projectMembers.map((m) => m.handle).filter(Boolean),
    [projectMembers],
  );
  const currentUserId = session?.user?.id || session?.user?.sub;
  const currentUserHandle = useMemo(() => {
    if (!currentUserId) return allAssignees[0] || null;
    return (
      projectMembers.find((m) => m.userId === currentUserId)?.handle ||
      allAssignees[0] ||
      null
    );
  }, [currentUserId, projectMembers, allAssignees]);

  const [projectsReady, setProjectsReady] = useState(false);
  const accessibleProjects = useMemo(() => {
    if (!currentUserId) return [];
    return getAccessibleProjects(projects, currentUserId);
  }, [projects, currentUserId]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (projectsReady) return;

    const userId = session?.user?.id || session?.user?.sub;
    if (!userId) return;

    const storedName = localStorage.getItem(`epico:displayName:${userId}`) || session?.user?.name || "User";
    setOnboardingDisplayName(storedName);

    const existingProjects = loadProjectsFromLocalStorage();
    const accessible = getAccessibleProjects(existingProjects, userId);

    let nextProjects = existingProjects;
    let nextCurrentProject = accessible[0] || null;

    if (!nextCurrentProject) {
      const ownerMember = {
        userId,
        name: storedName,
        handle: deriveHandleFromSession(session?.user, storedName),
      };
      const storedProductName = localStorage.getItem(`epico:productName:${userId}`);
      const projectTitle = storedProductName || storedName;
      const seedMissions = INITIAL_MISSIONS.map((m) => ({
        ...m,
        assignee: ownerMember.handle,
      }));
      const project = createProject({ title: projectTitle, ownerMember, missions: seedMissions });
      nextProjects = [project, ...existingProjects];
      nextCurrentProject = project;
    }

    setProjects(nextProjects);
    setCurrentProjectId(nextCurrentProject.id);
    saveProjectsToLocalStorage(nextProjects);
    setProjectsReady(true);
  }, [status, projectsReady, session]);

  useEffect(() => {
    if (!currentProject) return;
    setMissions(currentProject.missions || []);
    setSelectedMissionId(null);
    setEditingMission(null);
    setSelectedAssignees([]);
    setOnlyMyMissions(false);
  }, [currentProject?.id]);

  const visibleMissions = useMemo(() => {
    let result = missions;
    const typeKeys = Object.keys(selectedTypes).filter((t) => selectedTypes[t]);
    if (typeKeys.length > 0) result = result.filter((m) => typeKeys.includes(m.type));
    if (filterPriority !== "all") result = result.filter((m) => m.priority === filterPriority);
    if (dateFrom) result = result.filter((m) => m.date >= dateFrom);
    if (dateTo) result = result.filter((m) => m.date <= dateTo);
    if (selectedAssignees.length > 0) result = result.filter((m) => selectedAssignees.includes(m.assignee));
    if (laneFilter !== "All Mission") result = result.filter((m) => m.lane === laneFilter);
    if (onlyMyMissions && currentUserHandle) result = result.filter((m) => m.assignee === currentUserHandle);
    return result;
  }, [missions, selectedTypes, filterPriority, dateFrom, dateTo, selectedAssignees, laneFilter, onlyMyMissions, currentUserHandle]);

  useEffect(() => {
    if (!selectedMissionId) { setEditingMission(null); return; }
    const mission = missions.find((m) => m.id === selectedMissionId);
    setEditingMission(mission ? { ...mission } : null);
  }, [selectedMissionId, missions]);

  const hasActiveFilters =
    Object.values(selectedTypes).some(Boolean) ||
    filterPriority !== "all" ||
    dateFrom ||
    dateTo ||
    selectedAssignees.length > 0 ||
    laneFilter !== "All Mission" ||
    onlyMyMissions;

  function handleToggleType(type) {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  function handleApplyPreset(preset) {
    setFilterPreset(preset.id);
    setSelectedTypes({ feature: preset.chipKey === "feature", research: preset.chipKey === "research", task: preset.chipKey === "task" });
  }

  function handleToggleAssignee(name) {
    setSelectedAssignees((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  }

  function handleSaveFilter() {
    setShowFiltersSheet(false);
  }

  function handleResetFilters() {
    setSelectedTypes({ feature: false, research: false, task: false });
    setFilterPriority("all");
    setDateFrom("");
    setDateTo("");
    setSelectedAssignees([]);
    setFilterPreset(null);
    setOnlyMyMissions(false);
    setLaneFilter("All Mission");
  }

  function handleCreateMission({ title, type } = {}) {
    const missionTitle = (title || "").trim() || `Mission #${missions.length + 1}`;
    const nextId = missions.length > 0 ? Math.max(...missions.map((m) => m.id)) + 1 : 1;
    const createdMission = {
      id: nextId,
      title: missionTitle,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      type: type ?? "task",
      lane: "Backlog",
      priority: "medium",
      assignee: allAssignees[0] ?? "",
    };
    const nextMissions = [createdMission, ...missions];
    setMissions(nextMissions);
    setProjects((prev) => {
      const updated = prev.map((p) =>
        p.id === currentProjectId ? updateProjectMissions(p, nextMissions) : p,
      );
      saveProjectsToLocalStorage(updated);
      return updated;
    });
  }

  function handleCreateProject() {
    if (status !== "authenticated") return;
    const userId = currentUserId;
    if (!userId) return;
    const title = onboardingDisplayName || session?.user?.name || "Untitled";
    const ownerMember = { userId, name: title, handle: deriveHandleFromSession(session.user, title) };
    const project = createProject({ title, ownerMember });
    const nextProjects = [project, ...projects];
    setProjects(nextProjects);
    saveProjectsToLocalStorage(nextProjects);
    setCurrentProjectId(project.id);
    setMissions([]);
    setSelectedMissionId(null);
    setEditingMission(null);
    setSelectedAssignees([]);
    setOnlyMyMissions(false);
    setFilterPreset(null);
    handleResetFilters();
  }

  function handleRenameProjectTitle(projectId, title) {
    if (!projectId) return;
    setProjects((prev) => {
      const updated = prev.map((p) => p.id === projectId ? updateProjectTitle(p, title) : p);
      saveProjectsToLocalStorage(updated);
      return updated;
    });
  }

  function handleLeaveOrDeleteProject() {
    if (!currentProjectId || !currentUserId) return;
    setProjects((prev) => {
      const target = prev.find((p) => p.id === currentProjectId);
      if (!target) return prev;
      const isMember = (target.members || []).some((m) => m?.userId === currentUserId);
      if (!isMember) return prev;
      const nextProjects = (target.members?.length || 0) <= 1
        ? prev.filter((p) => p.id !== currentProjectId)
        : prev.map((p) => p.id === currentProjectId ? removeMemberFromProject(p, currentUserId) : p);
      const accessible = getAccessibleProjects(nextProjects, currentUserId);
      let nextProject = accessible[0] || null;
      if (!nextProject) {
        const title = onboardingDisplayName || session?.user?.name || "Untitled";
        const ownerMember = { userId: currentUserId, name: title, handle: deriveHandleFromSession(session.user, title) };
        nextProject = createProject({ title, ownerMember });
        nextProjects.unshift(nextProject);
      }
      setCurrentProjectId(nextProject.id);
      return nextProjects;
    });
  }

  function handleAddUserToProject() {
    if (!currentProjectId) return;
    const name = window.prompt("Member name:");
    if (!name) return;
    const usernameOrHandle = window.prompt("Username/handle (without @). Leave empty for auto:");
    const normalizedHandle = usernameOrHandle
      ? `@${String(usernameOrHandle).replace(/^@/, "").trim()}`
      : deriveHandleFromSession({ name }, name);
    const member = { userId: `member:${normalizedHandle}`, name: String(name), handle: normalizedHandle };
    setProjects((prev) => {
      const updated = prev.map((p) => p.id === currentProjectId ? addMemberToProject(p, member) : p);
      saveProjectsToLocalStorage(updated);
      return updated;
    });
    setSelectedAssignees([]);
  }

  function handleSaveMissionChanges() {
    if (!editingMission) return;
    const nextMissions = missions.map((m) => m.id === editingMission.id ? editingMission : m);
    setMissions(nextMissions);
    setProjects((prev) => {
      const updated = prev.map((p) => p.id === currentProjectId ? updateProjectMissions(p, nextMissions) : p);
      saveProjectsToLocalStorage(updated);
      return updated;
    });
    setSelectedMissionId(null);
  }

  function handleChangeEditingField(field, value) {
    setEditingMission((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  return (
    <RequireAuth>
      <RequireOnboarding>
        <div className="flex min-h-screen flex-col bg-[#131618] text-zinc-50 relative">
          {/* Desktop centering wrapper */}
          <div className="mx-auto w-full max-w-lg lg:border-x lg:border-white/[0.06] relative flex-1 flex flex-col">

            {/* Sticky header */}
            <div className="sticky top-0 z-30 bg-[#131618]">
              <MissionsHeader
                projectTitle={currentProject?.title}
                onOpenFilters={() => setShowFiltersSheet(true)}
                filtersActive={hasActiveFilters}
                onOpenProjectMenu={() => setShowProjectMenu(true)}
              />

              {/* Type chips */}
              {/* <TypeChips
                selectedTypes={selectedTypes}
                onToggleType={handleToggleType}
              /> */}

              {/* Create mission bar */}
              <div className="pb-2">
                <CreateMissionBar onCreate={handleCreateMission} />
              </div>

              {/* Missions count bar */}
              {/* <div className="flex items-center justify-between border-b border-white/[0.04] px-4 pb-2 text-[11px] text-zinc-600">
                <span>{visibleMissions.length} missions</span>
                <button
                  type="button"
                  onClick={() => setOnlyMyMissions((v) => !v)}
                  className={classNames(
                    "inline-flex items-center gap-1 text-[11px] font-medium transition-colors",
                    onlyMyMissions ? "text-emerald-400" : "text-zinc-600 hover:text-zinc-400",
                  )}
                >
                  <span className={classNames("h-1.5 w-1.5 rounded-full", onlyMyMissions ? "bg-emerald-400" : "bg-zinc-600")} />
                  Only mine
                </button>
              </div> */}
            </div>

            {/* Missions list or empty state */}
            <main className="flex-1 flex flex-col">
              {visibleMissions.length === 0 ? (
                <EmptyState />
              ) : (
                <MissionsList
                  missions={visibleMissions}
                  selectedMissionId={selectedMissionId}
                  onSelect={setSelectedMissionId}
                />
              )}
            </main>

            {/* Filters bottom sheet */}
            <BottomSheet
              open={showFiltersSheet}
              onClose={() => setShowFiltersSheet(false)}
              title="Filters"
            >
              <FiltersPanelContent
                onAddUser={handleAddUserToProject}
                filterPreset={filterPreset}
                onApplyPreset={handleApplyPreset}
                filterName={filterName}
                setFilterName={setFilterName}
                selectedTypes={selectedTypes}
                onToggleType={handleToggleType}
                laneFilter={laneFilter}
                setLaneFilter={setLaneFilter}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
                allAssignees={allAssignees}
                selectedAssignees={selectedAssignees}
                onToggleAssignee={handleToggleAssignee}
                onToggleAssigneesAll={() =>
                  setSelectedAssignees(selectedAssignees.length ? [] : [...allAssignees])
                }
                onlyMyMissions={onlyMyMissions}
                setOnlyMyMissions={setOnlyMyMissions}
                onReset={handleResetFilters}
                onSave={handleSaveFilter}
              />
            </BottomSheet>

            {/* Project menu */}
            <ProjectMenu
              open={showProjectMenu}
              onClose={() => setShowProjectMenu(false)}
              projects={accessibleProjects}
              currentProjectId={currentProjectId}
              onSelectProject={setCurrentProjectId}
              onCreateProject={handleCreateProject}
              onLeaveProject={handleLeaveOrDeleteProject}
              onRenameProject={handleRenameProjectTitle}
              onAddUser={handleAddUserToProject}
              currentUserId={currentUserId}
            />
          </div>

          {/* Full-screen mission detail overlay (outside max-w wrapper so it covers full screen) */}
          {selectedMissionId && (
            <MissionDetailPage
              mission={editingMission}
              allAssignees={allAssignees}
              onChangeField={handleChangeEditingField}
              onSave={handleSaveMissionChanges}
              onClose={() => setSelectedMissionId(null)}
            />
          )}
        </div>
      </RequireOnboarding>
    </RequireAuth>
  );
}
