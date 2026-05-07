"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  TYPE_CONFIG,
  LANES,
  FILTER_PRESETS,
  PRIORITY_VISUAL,
  PRIORITY_LABEL_EN,
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

/* ────────────────────────────────────────────────────────── */
/* Horizontal type-filter chips                              */
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
          "inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors",
          !anyActive
            ? "bg-white text-black"
            : "bg-white/10 text-zinc-400 hover:bg-white/15",
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
            "inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors",
            selectedTypes[key]
              ? "bg-white text-black"
              : "bg-white/10 text-zinc-400 hover:bg-white/15",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Bottom sheet wrapper                                       */
/* ────────────────────────────────────────────────────────── */
function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[#131316] ring-1 ring-white/[0.06] lg:left-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-[380px] lg:rounded-none lg:max-h-none">
        {/* Handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 lg:hidden">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        {/* Header */}
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
      {/* Presets */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Быстрые фильтры</p>
        <div className="flex flex-wrap gap-2">
          {FILTER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={classNames(
                "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                filterPreset === preset.id
                  ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                  : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mission type */}
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
                  ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                  : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
              )}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lane */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Статус</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLaneFilter("All Mission")}
            className={classNames(
              "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
              laneFilter === "All Mission"
                ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
            )}
          >
            Все
          </button>
          {LANES.map((lane) => (
            <button
              key={lane}
              type="button"
              onClick={() => setLaneFilter(lane)}
              className={classNames(
                "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                laneFilter === lane
                  ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                  : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
              )}
            >
              {lane}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Приоритет</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterPriority("all")}
            className={classNames(
              "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
              filterPriority === "all"
                ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
            )}
          >
            Все
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
                    ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                    : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
                )}
              >
                <span className={classNames("text-[10px]", visual?.color)}>{visual?.icon}</span>
                {PRIORITY_LABEL_EN[key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-[11px] font-medium text-zinc-400">С даты</p>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-xl bg-white/5 px-3 py-2 text-[12px] text-zinc-200 ring-1 ring-white/10 focus:outline-none focus:ring-emerald-500/60"
          />
        </div>
        <div>
          <p className="mb-1 text-[11px] font-medium text-zinc-400">По дату</p>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-xl bg-white/5 px-3 py-2 text-[12px] text-zinc-200 ring-1 ring-white/10 focus:outline-none focus:ring-emerald-500/60"
          />
        </div>
      </div>

      {/* Assignees */}
      {allAssignees.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Исполнители</p>
            <button
              type="button"
              onClick={onToggleAssigneesAll}
              className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300"
            >
              {selectedAssignees.length ? "Сбросить" : "Все"}
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
                    ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                    : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
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

      {/* Only my missions */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-zinc-300">Только мои миссии</span>
        <button
          type="button"
          role="switch"
          aria-checked={onlyMyMissions}
          onClick={() => setOnlyMyMissions((v) => !v)}
          className={classNames(
            "relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors",
            onlyMyMissions ? "bg-emerald-500" : "bg-white/15",
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

      {/* Add user */}
      {onAddUser && (
        <button
          type="button"
          onClick={onAddUser}
          className="w-full rounded-xl bg-white/5 py-2.5 text-[12px] font-medium text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
        >
          + Добавить участника
        </button>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-xl bg-white/5 py-2.5 text-[12px] font-medium text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
        >
          Сбросить
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-[12px] font-semibold text-black hover:bg-emerald-400 transition-colors"
        >
          Применить
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Mission details panel content                              */
/* ────────────────────────────────────────────────────────── */
function MissionDetailContent({ mission, allAssignees, onChangeField, onSave }) {
  if (!mission) return null;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Название</p>
        <input
          type="text"
          value={mission.title}
          onChange={(e) => onChangeField("title", e.target.value)}
          className="w-full rounded-xl bg-white/5 px-3 py-2.5 text-[13px] text-zinc-100 ring-1 ring-white/10 focus:outline-none focus:ring-emerald-500/60"
        />
      </div>

      {/* Type */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Тип</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(TYPE_CONFIG).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => onChangeField("type", key)}
              className={classNames(
                "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                mission.type === key
                  ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                  : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
              )}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Приоритет</p>
        <div className="flex flex-wrap gap-1.5">
          {["lowest", "low", "medium", "high", "highest"].map((key) => {
            const visual = PRIORITY_VISUAL[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChangeField("priority", key)}
                className={classNames(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                  mission.priority === key
                    ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                    : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
                )}
              >
                <span className={classNames("text-[10px]", visual?.color)}>{visual?.icon}</span>
                {PRIORITY_LABEL_EN[key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lane */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Статус</p>
        <div className="flex flex-wrap gap-1.5">
          {LANES.map((lane) => (
            <button
              key={lane}
              type="button"
              onClick={() => onChangeField("lane", lane)}
              className={classNames(
                "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                mission.lane === lane
                  ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                  : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
              )}
            >
              {lane}
            </button>
          ))}
        </div>
      </div>

      {/* Date & time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-[11px] font-medium text-zinc-400">Дата</p>
          <input
            type="date"
            value={mission.date}
            onChange={(e) => onChangeField("date", e.target.value)}
            className="w-full rounded-xl bg-white/5 px-3 py-2 text-[12px] text-zinc-200 ring-1 ring-white/10 focus:outline-none"
          />
        </div>
        <div>
          <p className="mb-1 text-[11px] font-medium text-zinc-400">Время</p>
          <input
            type="time"
            value={mission.time}
            onChange={(e) => onChangeField("time", e.target.value)}
            className="w-full rounded-xl bg-white/5 px-3 py-2 text-[12px] text-zinc-200 ring-1 ring-white/10 focus:outline-none"
          />
        </div>
      </div>

      {/* Assignee */}
      {allAssignees.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Исполнитель</p>
          <div className="flex flex-wrap gap-1.5">
            {allAssignees.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => onChangeField("assignee", name)}
                className={classNames(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                  mission.assignee === name
                    ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                    : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
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

      {/* Save */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSave}
          className="w-full rounded-xl bg-emerald-500 py-3 text-[13px] font-semibold text-black hover:bg-emerald-400 transition-colors"
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Project switcher drawer                                    */
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
    <BottomSheet open={open} onClose={onClose} title="Проект">
      <div className="space-y-4">
        {/* Current project title */}
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Название продукта</p>
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
                className="flex-1 rounded-xl bg-white/5 px-3 py-2 text-[13px] text-zinc-100 ring-1 ring-white/10 focus:outline-none focus:ring-emerald-500/60"
              />
              <button
                type="button"
                onClick={() => {
                  onRenameProject(currentProjectId, draftTitle);
                  setEditingTitle(false);
                }}
                className="rounded-xl bg-emerald-500 px-3 py-2 text-[12px] font-semibold text-black"
              >
                ОК
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraftTitle(currentProject?.title || "");
                setEditingTitle(true);
              }}
              className="w-full rounded-xl bg-white/5 px-3 py-2.5 text-left text-[13px] text-zinc-100 ring-1 ring-white/10 hover:ring-white/20"
            >
              {currentProject?.title || "Без названия"}
              <span className="ml-2 text-[11px] text-zinc-500">· нажми для изменения</span>
            </button>
          )}
        </div>

        {/* Members */}
        {currentProject?.members?.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Участники</p>
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

        {/* Switch project */}
        {projects.length > 1 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Переключить продукт</p>
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
                      : "bg-white/5 text-zinc-300 hover:bg-white/10",
                  )}
                >
                  {p.title || "Без названия"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={() => { onAddUser(); onClose(); }}
            className="w-full rounded-xl bg-white/5 py-2.5 text-[12px] font-medium text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
          >
            + Добавить участника
          </button>
          <button
            type="button"
            onClick={() => { onCreateProject(); onClose(); }}
            className="w-full rounded-xl bg-white/5 py-2.5 text-[12px] font-medium text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
          >
            + Новый продукт
          </button>
          <button
            type="button"
            onClick={() => { onLeaveProject(); onClose(); }}
            className="w-full rounded-xl bg-rose-500/10 py-2.5 text-[12px] font-medium text-rose-400 ring-1 ring-rose-500/30 hover:bg-rose-500/20 transition-colors"
          >
            {currentProject?.members?.length <= 1 ? "Удалить продукт" : "Покинуть продукт"}
          </button>
        </div>
      </div>
    </BottomSheet>
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
  const [draftTitle, setDraftTitle] = useState("");
  const [draftType, setDraftType] = useState("feature");
  const [draftPriority, setDraftPriority] = useState("medium");
  const [draftLane, setDraftLane] = useState("Backlog");
  const [showDraftConfigurator, setShowDraftConfigurator] = useState(false);
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

  // UI state
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

  function handleCreateMission() {
    const title = draftTitle.trim() || `Новая миссия #${missions.length + 1}`;
    const nextId = missions[0]?.id ? Math.max(...missions.map((m) => m.id)) + 1 : 1;
    const createdMission = {
      id: nextId,
      title,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      type: draftType,
      lane: draftLane,
      priority: draftPriority,
      assignee: allAssignees[0] ?? "@new",
    };
    const nextMissions = [createdMission, ...missions];
    setMissions(nextMissions);
    setProjects((prev) => {
      const updated = prev.map((p) => p.id === currentProjectId ? updateProjectMissions(p, nextMissions) : p);
      saveProjectsToLocalStorage(updated);
      return updated;
    });
    setDraftTitle("");
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
    const name = window.prompt("Имя пользователя:");
    if (!name) return;
    const usernameOrHandle = window.prompt("Username/handle (без @). Оставьте пустым для авто-генерации:");
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
        <div className="flex min-h-screen flex-col bg-[#0d0d0f] text-zinc-50 relative">
          {/* Desktop centering wrapper */}
          <div className="mx-auto w-full max-w-lg lg:border-x lg:border-white/[0.06] relative flex-1 flex flex-col">
          {/* Sticky header */}
          <div className="sticky top-0 z-30 bg-[#0d0d0f]">
            <MissionsHeader
              projectTitle={currentProject?.title}
              onOpenFilters={() => setShowFiltersSheet(true)}
              filtersActive={hasActiveFilters}
            />

            {/* Type chips */}
            <TypeChips
              selectedTypes={selectedTypes}
              onToggleType={handleToggleType}
            />

            {/* Create mission bar */}
            <div className="pb-2">
              <CreateMissionBar
                draftTitle={draftTitle}
                setDraftTitle={setDraftTitle}
                onCreate={handleCreateMission}
                showConfigurator={showDraftConfigurator}
                setShowConfigurator={setShowDraftConfigurator}
                draftType={draftType}
                setDraftType={setDraftType}
                draftPriority={draftPriority}
                setDraftPriority={setDraftPriority}
                draftLane={draftLane}
                setDraftLane={setDraftLane}
              />
            </div>

            {/* Missions count bar */}
            <div className="flex items-center justify-between border-b border-white/[0.04] px-4 pb-2 text-[11px] text-zinc-600">
              <span>{visibleMissions.length} миссий</span>
              <button
                type="button"
                onClick={() => setOnlyMyMissions((v) => !v)}
                className={classNames(
                  "inline-flex items-center gap-1 text-[11px] font-medium transition-colors",
                  onlyMyMissions ? "text-emerald-400" : "text-zinc-600 hover:text-zinc-400",
                )}
              >
                <span className={classNames("h-1.5 w-1.5 rounded-full", onlyMyMissions ? "bg-emerald-400" : "bg-zinc-600")} />
                Только мои
              </button>
            </div>
          </div>

          {/* Missions list */}
          <main className="flex-1">
            <MissionsList
              missions={visibleMissions}
              selectedMissionId={selectedMissionId}
              onSelect={setSelectedMissionId}
            />
          </main>

          {/* Filters bottom sheet */}
          <BottomSheet
            open={showFiltersSheet}
            onClose={() => setShowFiltersSheet(false)}
            title="Фильтры"
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

          {/* Mission details bottom sheet */}
          <BottomSheet
            open={!!selectedMissionId}
            onClose={() => setSelectedMissionId(null)}
            title="Детали миссии"
          >
            <MissionDetailContent
              mission={editingMission}
              allAssignees={allAssignees}
              onChangeField={handleChangeEditingField}
              onSave={handleSaveMissionChanges}
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
        </div>
      </RequireOnboarding>
    </RequireAuth>
  );
}
