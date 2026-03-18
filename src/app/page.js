"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FILTER_PRESETS,
  INITIAL_MISSIONS,
  PRIORITY_CONFIG_RU,
  PRIORITY_LABEL_EN,
  PRIORITY_VISUAL,
  TYPE_CONFIG,
} from "../features/missions/constants";
import { classNames } from "../shared/ui";
import { MissionsHeader } from "../features/missions/ui/MissionsHeader";
import { MissionsList } from "../features/missions/ui/MissionsList";
import { CreateMissionBar } from "../features/missions/ui/CreateMissionBar";
import { MissionsSidebar } from "../features/missions/ui/MissionsSidebar";

function MissionTypeBadge({ type }) {
  const config = TYPE_CONFIG[type];

  if (!config) return null;

  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        "bg-opacity-10 text-zinc-100 border border-white/5",
        type === "feature" && "bg-sky-500/10 text-sky-100 border-sky-500/40",
        type === "research" &&
          "bg-violet-500/10 text-violet-100 border-violet-500/40",
        type === "task" &&
          "bg-emerald-500/10 text-emerald-100 border-emerald-500/40",
      )}
    >
      <span
        className={classNames(
          "mr-1 h-1.5 w-1.5 rounded-full",
          TYPE_CONFIG[type].color,
        )}
      />
      {config.label}
    </span>
  );
}

// (moved into panels; kept page lean)

function PriorityInline({ priority }) {
  const visual = PRIORITY_VISUAL[priority];
  if (!visual) return null;
  return (
    <span className={classNames("text-[11px] leading-none", visual.color)}>
      {visual.icon}
    </span>
  );
}

export default function Home() {
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftType, setDraftType] = useState("feature");
  const [draftPriority, setDraftPriority] = useState("medium");
  const [draftLane, setDraftLane] = useState("Backlog");
  const [showDraftConfigurator, setShowDraftConfigurator] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState({
    feature: false,
    research: false,
    task: false,
  });
  const [openFilterPanel, setOpenFilterPanel] = useState(true);
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

  const allAssignees = useMemo(
    () => Array.from(new Set(missions.map((m) => m.assignee))),
    [missions],
  );

  const visibleMissions = useMemo(() => {
    let result = missions;

    const typeKeys = Object.keys(selectedTypes).filter(
      (t) => selectedTypes[t],
    );
    if (typeKeys.length > 0) {
      result = result.filter((m) => typeKeys.includes(m.type));
    }

    if (filterPriority !== "all") {
      result = result.filter((m) => m.priority === filterPriority);
    }

    if (dateFrom) {
      result = result.filter((m) => m.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((m) => m.date <= dateTo);
    }

    if (selectedAssignees.length > 0) {
      result = result.filter((m) =>
        selectedAssignees.includes(m.assignee),
      );
    }

    if (laneFilter !== "All Mission") {
      result = result.filter((m) => m.lane === laneFilter);
    }

    if (onlyMyMissions) {
      result = result.slice(0, 3);
    }

    return result;
  }, [
    missions,
    selectedTypes,
    filterPriority,
    dateFrom,
    dateTo,
    selectedAssignees,
    laneFilter,
    onlyMyMissions,
  ]);

  useEffect(() => {
    if (!selectedMissionId) {
      setEditingMission(null);
      return;
    }
    const mission = missions.find((m) => m.id === selectedMissionId);
    setEditingMission(mission ? { ...mission } : null);
  }, [selectedMissionId, missions]);

  function handleToggleType(type) {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  function handleApplyPreset(preset) {
    setFilterPreset(preset.id);
    setSelectedTypes({
      feature: preset.chipKey === "feature",
      research: preset.chipKey === "research",
      task: preset.chipKey === "task",
    });
  }

  function handleToggleAssignee(name) {
    setSelectedAssignees((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }

  function handleSaveFilter() {
    const activeTypes = Object.entries(selectedTypes)
      .filter(([, active]) => active)
      .map(([key]) => TYPE_CONFIG[key].label)
      .join(", ");

    const activeAssignees =
      selectedAssignees.length > 0 ? selectedAssignees.join(", ") : "Все";

    const summary = [
      `Типы: ${activeTypes || "Все"}`,
      `Приоритет: ${
        filterPriority === "all" ? "Все" : PRIORITY_CONFIG_RU[filterPriority]
      }`,
      `Исполнители: ${activeAssignees}`,
    ].join("\n");

    alert(`Фильтр "${filterName}" сохранён.\n\n${summary}`);
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
    const title =
      draftTitle.trim() || `Новая миссия #${missions.length + 1}`;
    const nextId = missions[missions.length - 1]?.id + 1 || 1;
    setMissions((prev) => [
      {
        id: nextId,
        title,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: draftType,
        lane: draftLane,
        priority: draftPriority,
        assignee: allAssignees[0] ?? "@new",
      },
      ...prev,
    ]);
    setDraftTitle("");
  }

  function handleSaveMissionChanges() {
    if (!editingMission) return;

    setMissions((prev) =>
      prev.map((m) => (m.id === editingMission.id ? editingMission : m)),
    );
  }

  function handleChangeEditingField(field, value) {
    setEditingMission((prev) =>
      prev ? { ...prev, [field]: value } : prev,
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#05060a] to-[#050509] text-zinc-50">
      <main className="flex w-full flex-col px-8 py-6 lg:px-10 lg:py-8">
        <MissionsHeader />

        <section className="flex flex-1 flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
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

            <div className="mb-3 flex items-center justify-between text-[11px] font-medium text-zinc-500">
              <span>
                Всего миссий:{" "}
                <span className="text-zinc-200">{visibleMissions.length}</span>
              </span>
              <button
                type="button"
                onClick={() => setOnlyMyMissions((v) => !v)}
                className="inline-flex items-center gap-1 rounded-full bg-zinc-950/60 px-3 py-1 text-[11px] font-medium ring-1 ring-zinc-800/90 hover:bg-zinc-900"
              >
                <span
                  className={classNames(
                    "h-1.5 w-1.5 rounded-full",
                    onlyMyMissions ? "bg-emerald-400" : "bg-zinc-600",
                  )}
                />
                Только мои
              </button>
            </div>

            <MissionsList
              missions={visibleMissions}
              selectedMissionId={selectedMissionId}
              onSelect={setSelectedMissionId}
            />
          </div>

          <MissionsSidebar
            editingMission={editingMission}
            allAssignees={allAssignees}
            onBackToFilters={() => setSelectedMissionId(null)}
            onChangeEditingField={handleChangeEditingField}
            onSaveMissionChanges={handleSaveMissionChanges}
            openFilterPanel={openFilterPanel}
            setOpenFilterPanel={setOpenFilterPanel}
            filterPreset={filterPreset}
            handleApplyPreset={handleApplyPreset}
            filterName={filterName}
            setFilterName={setFilterName}
            selectedTypes={selectedTypes}
            handleToggleType={handleToggleType}
            laneFilter={laneFilter}
            setLaneFilter={setLaneFilter}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            selectedAssignees={selectedAssignees}
            handleToggleAssignee={handleToggleAssignee}
            handleToggleAssigneesAll={() =>
              setSelectedAssignees(
                selectedAssignees.length ? [] : [...allAssignees],
              )
            }
            onlyMyMissions={onlyMyMissions}
            setOnlyMyMissions={setOnlyMyMissions}
            handleResetFilters={handleResetFilters}
            handleSaveFilter={handleSaveFilter}
          />
        </section>
      </main>
    </div>
  );
}
