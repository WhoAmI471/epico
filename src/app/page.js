"use client";

import { useEffect, useMemo, useState } from "react";

const INITIAL_MISSIONS = [
  {
    id: 1,
    title: "Исследовать путь пользователя по воронке от входа до корзины",
    date: "2024-04-12",
    time: "11:24",
    type: "research",
    lane: "Backlog",
    priority: "medium",
    assignee: "@leonidlapidus",
  },
  {
    id: 2,
    title: "Исследовать путь пользователя по воронке от входа до корзины",
    date: "2024-04-11",
    time: "11:24",
    type: "feature",
    lane: "Research",
    priority: "highest",
    assignee: "@vvmalya",
  },
  {
    id: 3,
    title: "Исследовать путь пользователя по воронке от входа до корзины",
    date: "2024-04-11",
    time: "11:24",
    type: "task",
    lane: "Development",
    priority: "low",
    assignee: "@ElderlyTM",
  },
  {
    id: 4,
    title: "Исследовать путь пользователя по воронке от входа до корзины",
    date: "2024-04-11",
    time: "11:24",
    type: "feature",
    lane: "QA & Test",
    priority: "high",
    assignee: "@IgorVict",
  },
  {
    id: 5,
    title: "Исследовать путь пользователя по воронке от входа до корзины",
    date: "2024-04-11",
    time: "11:24",
    type: "research",
    lane: "Business Analysis",
    priority: "medium",
    assignee: "@paveldurov",
  },
];

const TYPE_CONFIG = {
  feature: { label: "Feature", color: "bg-violet-500" },
  research: { label: "Research", color: "bg-sky-500" },
  task: { label: "Task", color: "bg-emerald-500" },
};

const PRIORITY_CONFIG = {
  lowest: "Самый низкий",
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  highest: "Самый высокий",
};

const PRIORITY_VISUAL = {
  lowest: { icon: "˅˅", color: "text-emerald-400" },
  low: { icon: "˅", color: "text-emerald-400" },
  medium: { icon: "=", color: "text-amber-300" },
  high: { icon: "˄", color: "text-rose-400" },
  highest: { icon: "˄˄", color: "text-rose-400" },
};

const PRIORITY_LABEL_EN = {
  lowest: "Lowest",
  low: "Low",
  medium: "Medium",
  high: "High",
  highest: "Highest",
};

const LANE_CONFIG = {
  Backlog: {
    bg: "bg-rose-700",
    text: "text-white",
  },
  Research: {
    bg: "bg-violet-600",
    text: "text-white",
  },
  Development: {
    bg: "bg-sky-600",
    text: "text-white",
  },
  "QA & Test": {
    bg: "bg-emerald-600",
    text: "text-white",
  },
  "Business Analysis": {
    bg: "bg-amber-600",
    text: "text-white",
  },
};

const FILTER_PRESETS = [
  { id: "only-features", label: "Only Features", chipKey: "feature" },
  { id: "only-researches", label: "Only Researches", chipKey: "research" },
  { id: "only-tasks", label: "Only Tasks", chipKey: "task" },
];

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

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

function LaneChip({ label, active }) {
  return (
    <button
      type="button"
      className={classNames(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-zinc-100 text-zinc-900"
          : "bg-zinc-800/70 text-zinc-100 hover:bg-zinc-700",
      )}
    >
      {label}
    </button>
  );
}

function FilterTag({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-emerald-400 bg-emerald-500/15 text-emerald-100"
          : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500",
      )}
    >
      {label}
    </button>
  );
}

function AssigneeChip({ name, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={classNames(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        selected
          ? "border-emerald-400 bg-emerald-500/15 text-emerald-100"
          : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500",
      )}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-[11px] font-semibold text-white">
        {name.replace("@", "").slice(0, 2)}
      </span>
      {name}
    </button>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={classNames(
        "inline-flex h-6 w-11 items-center rounded-full border transition-colors",
        checked
          ? "border-emerald-500 bg-emerald-500/30"
          : "border-zinc-600 bg-zinc-900",
      )}
    >
      <span
        className={classNames(
          "ml-0.5 inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}

function MissionShapeIcon({ type }) {
  return (
    <span className="inline-flex h-7 w-7 flex-none items-center justify-center text-[11px] text-zinc-100">
      {type === "research" && (
        <span className="h-3.5 w-3.5 rounded-full bg-sky-500" />
      )}
      {type === "feature" && (
        <span className="h-3.5 w-3.5 bg-violet-500" />
      )}
      {type === "task" && (
        <span className="text-[13px] font-semibold text-emerald-400">
          ▲
        </span>
      )}
    </span>
  );
}

function PriorityInline({ priority }) {
  const visual = PRIORITY_VISUAL[priority];
  if (!visual) return null;

  return (
    <span
      className={classNames(
        "text-[11px] leading-none",
        visual.color,
      )}
    >
      {visual.icon}
    </span>
  );
}

function LanePill({ lane }) {
  const cfg = LANE_CONFIG[lane] || {
    bg: "bg-zinc-800",
    text: "text-zinc-100",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium",
        cfg.bg,
        cfg.text,
      )}
    >
      {lane}
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
        filterPriority === "all" ? "Все" : PRIORITY_CONFIG[filterPriority]
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
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-lg shadow-violet-500/40">
              <span className="text-lg font-bold leading-none">E</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight">
                  Product`s title
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-300 ring-1 ring-zinc-700/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  В работе
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                Управление миссиями продукта, исследованиями и задачами.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["L", "V", "E", "I", "P"].map((initial, index) => (
                <span
                  key={initial}
                  className={classNames(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-900 text-[11px] font-semibold text-white",
                    index === 0 && "bg-gradient-to-tr from-sky-500 to-violet-500",
                    index === 1 &&
                      "bg-gradient-to-tr from-fuchsia-500 to-amber-400",
                    index === 2 &&
                      "bg-gradient-to-tr from-emerald-500 to-lime-400",
                    index === 3 &&
                      "bg-gradient-to-tr from-indigo-500 to-sky-400",
                    index === 4 &&
                      "bg-gradient-to-tr from-rose-500 to-orange-400",
                  )}
                >
                  {initial}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-zinc-900/80 px-4 text-xs font-medium text-zinc-200 ring-1 ring-zinc-700/80 hover:bg-zinc-800"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 text-sm ring-1 ring-zinc-700/80 hover:bg-zinc-800"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-[13px] font-semibold">
                ?
              </span>
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 ring-1 ring-zinc-700/80 hover:bg-zinc-800"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold">
                👤
              </span>
            </button>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-zinc-950/70 px-4 py-2.5 ring-1 ring-zinc-800/90">
                <button
                  type="button"
                  onClick={() =>
                    setShowDraftConfigurator((value) => !value)
                  }
                  className="mr-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-zinc-200 ring-1 ring-zinc-700 hover:bg-zinc-800"
                  title="Настроить тип и статус создаваемой миссии"
                >
                  +
                </button>
                <input
                  type="text"
                  className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                  placeholder="Add mission"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleCreateMission}
                  className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-emerald-500 text-sm font-semibold text-zinc-950 shadow shadow-emerald-500/40 hover:bg-emerald-400"
                  title="Создать миссию"
                >
                  +
                </button>

                {showDraftConfigurator && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl bg-zinc-950 p-3 text-xs text-zinc-200 shadow-xl ring-1 ring-zinc-800">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Новая миссия
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowDraftConfigurator(false)}
                        className="rounded-full px-2 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-900"
                      >
                        Закрыть
                      </button>
                    </div>
                    <div className="mb-3">
                      <p className="mb-1 text-[11px] font-medium text-zinc-300">
                        Тип
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setDraftType(key)}
                            className={classNames(
                              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                              draftType === key
                                ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                                : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                            )}
                          >
                            <span className="inline-flex h-3.5 w-3.5 items-center justify-center">
                              {key === "research" && (
                                <span className="h-3 w-3 rounded-full bg-sky-500" />
                              )}
                              {key === "feature" && (
                                <span className="h-3 w-3 bg-violet-500" />
                              )}
                              {key === "task" && (
                                <span className="text-[12px] font-semibold text-emerald-400">
                                  ▲
                                </span>
                              )}
                            </span>
                            {config.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="mb-1 text-[11px] font-medium text-zinc-300">
                        Приоритет
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["lowest", "low", "medium", "high", "highest"].map(
                          (key) => {
                            const visual = PRIORITY_VISUAL[key];
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setDraftPriority(key)}
                                className={classNames(
                                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                                  draftPriority === key
                                    ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                                    : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                                )}
                              >
                                <span
                                  className={classNames(
                                    "text-[11px] leading-none",
                                    visual?.color,
                                  )}
                                >
                                  {visual?.icon}
                                </span>
                                <span>{PRIORITY_CONFIG[key]}</span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-medium text-zinc-300">
                        Статус (колонка)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Backlog",
                          "Research",
                          "Development",
                          "QA & Test",
                          "Business Analysis",
                        ].map((lane) => (
                          <button
                            key={lane}
                            type="button"
                            onClick={() => setDraftLane(lane)}
                            className={classNames(
                              "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                              draftLane === lane
                                ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                                : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                            )}
                          >
                            {lane}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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

            <div className="space-y-1.5 rounded-2xl bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 p-2 ring-1 ring-zinc-900">
              {visibleMissions.map((mission) => (
                <article
                  key={mission.id}
                  onClick={() => setSelectedMissionId(mission.id)}
                  className={classNames(
                    "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-zinc-100 hover:bg-zinc-900/80",
                    selectedMissionId === mission.id &&
                      "ring-1 ring-emerald-500/60 bg-zinc-900",
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <MissionShapeIcon type={mission.type} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[13px] font-medium">
                          {mission.title}
                        </p>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                        <PriorityInline priority={mission.priority} />
                        <span>
                          {new Date(mission.date).toLocaleDateString("ru-RU")}{" "}
                          · {mission.time}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/80 px-2 py-0.5 ring-1 ring-zinc-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {mission.assignee}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-1 text-[11px] text-zinc-500">
                    <LanePill lane={mission.lane} />
                  </div>
                </article>
              ))}
              {visibleMissions.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 px-6 py-10 text-center text-sm text-zinc-500">
                  <p className="mb-1 font-medium">
                    Миссии по текущим фильтрам не найдены
                  </p>
                  <p className="text-xs text-zinc-500">
                    Измените параметры фильтра или создайте новую миссию.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="mt-4 w-full rounded-2xl bg-zinc-950/80 p-4 ring-1 ring-zinc-900/90 sm:mt-0 sm:w-[320px] lg:w-[360px]">
            {editingMission ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-50">
                      Mission details
                    </h2>
                    <p className="text-[11px] text-zinc-500">
                      Редактируйте выбранную миссию и сохраните изменения.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMissionId(null)}
                    className="inline-flex h-8 items-center justify-center rounded-full bg-zinc-900/90 px-3 text-[11px] font-medium text-zinc-200 ring-1 ring-zinc-700/80 hover:bg-zinc-800"
                  >
                    К фильтрам
                  </button>
                </div>

                <div className="space-y-4 rounded-xl bg-zinc-950/80 p-3.5 ring-1 ring-zinc-900">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">
                      Название миссии
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                      value={editingMission.title}
                      onChange={(e) =>
                        handleChangeEditingField("title", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <p className="mb-1.5 text-xs font-medium text-zinc-300">
                      Mission type
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleChangeEditingField("type", key)}
                          className={classNames(
                            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                            editingMission.type === key
                              ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                              : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                          )}
                        >
                          <span className="inline-flex h-3.5 w-3.5 items-center justify-center">
                            {key === "research" && (
                              <span className="h-3 w-3 rounded-full bg-sky-500" />
                            )}
                            {key === "feature" && (
                              <span className="h-3 w-3 bg-violet-500" />
                            )}
                            {key === "task" && (
                              <span className="text-[12px] font-semibold text-emerald-400">
                                ▲
                              </span>
                            )}
                          </span>
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 text-xs font-medium text-zinc-300">
                      Priority
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["lowest", "low", "medium", "high", "highest"].map(
                        (key) => {
                          const visual = PRIORITY_VISUAL[key];
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() =>
                                handleChangeEditingField("priority", key)
                              }
                              className={classNames(
                                "inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium ring-1 transition-colors",
                                editingMission.priority === key
                                  ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                                  : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                              )}
                            >
                              <span
                                className={classNames(
                                  "text-[11px] leading-none",
                                  visual?.color,
                                )}
                              >
                                {visual?.icon}
                              </span>
                              <span>{PRIORITY_LABEL_EN[key]}</span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 text-xs font-medium text-zinc-300">
                      Колонка
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Backlog",
                        "Research",
                        "Development",
                        "QA & Test",
                        "Business Analysis",
                      ].map((lane) => (
                        <button
                          key={lane}
                          type="button"
                          onClick={() =>
                            handleChangeEditingField("lane", lane)
                          }
                          className={classNames(
                            "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                            editingMission.lane === lane
                              ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                              : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                          )}
                        >
                          {lane}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="mb-1 text-[11px] font-medium text-zinc-300">
                        Дата
                      </p>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                        value={editingMission.date}
                        onChange={(e) =>
                          handleChangeEditingField("date", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-medium text-zinc-300">
                        Время
                      </p>
                      <input
                        type="time"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                        value={editingMission.time}
                        onChange={(e) =>
                          handleChangeEditingField("time", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-xs font-medium text-zinc-300">
                        Assignee
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          handleChangeEditingField(
                            "assignee",
                            allAssignees[0] ?? editingMission.assignee,
                          )
                        }
                        className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300"
                      >
                        Сбросить к первому
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {allAssignees.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() =>
                            handleChangeEditingField("assignee", name)
                          }
                          className={classNames(
                            "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                            editingMission.assignee === name
                              ? "border-emerald-400 bg-emerald-500/15 text-emerald-100"
                              : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500",
                          )}
                        >
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-[11px] font-semibold text-white">
                            {name.replace("@", "").slice(0, 2)}
                          </span>
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-zinc-800 pt-3">
                    <button
                      type="button"
                      onClick={handleSaveMissionChanges}
                      className="rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-zinc-950 shadow shadow-emerald-500/40 hover:bg-emerald-400"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-50">
                      Filters
                    </h2>
                    <p className="text-[11px] text-zinc-500">
                      Настройте отображение миссий по нужным критериям.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenFilterPanel((v) => !v)}
                    className="inline-flex h-8 items-center justify-center rounded-full bg-zinc-900/90 px-3 text-[11px] font-medium text-zinc-200 ring-1 ring-zinc-700/80 hover:bg-zinc-800"
                  >
                    {openFilterPanel ? "Скрыть" : "Показать"}
                  </button>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {FILTER_PRESETS.map((preset) => (
                    <FilterTag
                      key={preset.id}
                      label={preset.label}
                      active={filterPreset === preset.id}
                      onClick={() => handleApplyPreset(preset)}
                    />
                  ))}
                </div>

                {openFilterPanel && (
                  <div className="space-y-4 rounded-xl bg-zinc-950/80 p-3.5 ring-1 ring-zinc-900">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-300">
                          Name
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          Сохраняется локально
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                      />
                    </div>

                    <div>
                      <p className="mb-1.5 text-xs font-medium text-zinc-300">
                        Mission type
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleToggleType(key)}
                            className={classNames(
                              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                              selectedTypes[key]
                                ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                                : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                            )}
                          >
                            <span className="inline-flex h-3.5 w-3.5 items-center justify-center">
                              {key === "research" && (
                                <span className="h-3 w-3 rounded-full bg-sky-500" />
                              )}
                              {key === "feature" && (
                                <span className="h-3 w-3 bg-violet-500" />
                              )}
                              {key === "task" && (
                                <span className="text-[12px] font-semibold text-emerald-400">
                                  ▲
                                </span>
                              )}
                            </span>
                            {config.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-xs font-medium text-zinc-300">
                        Колонка (статус)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setLaneFilter("All Mission")}
                          className={classNames(
                            "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                            laneFilter === "All Mission"
                              ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                              : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                          )}
                        >
                          All Mission
                        </button>
                        {[
                          "Backlog",
                          "Research",
                          "Development",
                          "QA & Test",
                          "Business Analysis",
                        ].map((lane) => (
                          <button
                            key={lane}
                            type="button"
                            onClick={() => setLaneFilter(lane)}
                            className={classNames(
                              "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                              laneFilter === lane
                                ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                                : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                            )}
                          >
                            {lane}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-xs font-medium text-zinc-300">
                        Priority
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFilterPriority("all")}
                          className={classNames(
                            "rounded-lg px-2 py-1.5 text-[11px] font-medium ring-1 transition-colors",
                            filterPriority === "all"
                              ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                              : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                          )}
                        >
                          All
                        </button>
                        {["lowest", "low", "medium", "high", "highest"].map(
                          (key) => {
                            const visual = PRIORITY_VISUAL[key];
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setFilterPriority(key)}
                                className={classNames(
                                  "inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium ring-1 transition-colors",
                                  filterPriority === key
                                    ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                                    : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                                )}
                              >
                                <span
                                  className={classNames(
                                    "text-[11px] leading-none",
                                    visual?.color,
                                  )}
                                >
                                  {visual?.icon}
                                </span>
                                <span>{PRIORITY_LABEL_EN[key]}</span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="mb-1 text-[11px] font-medium text-зinc-300">
                          From
                        </p>
                        <input
                          type="date"
                          className="w-full rounded-lg border border-zinc-800 bg-зinc-950 px-2 py-1.5 text-xs text-зinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                        />
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] font-medium text-зinc-300">
                          To
                        </p>
                        <input
                          type="date"
                          className="w-full rounded-lg border border-зinc-800 bg-зinc-950 px-2 py-1.5 text-xs text-зinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <p className="text-xs font-medium text-зinc-300">
                          Assignee
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAssignees(
                              selectedAssignees.length ? [] : [...allAssignees],
                            )
                          }
                          className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300"
                        >
                          {selectedAssignees.length
                            ? "Сбросить"
                            : "Выбрать всех"}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {allAssignees.map((name) => (
                          <AssigneeChip
                            key={name}
                            name={name}
                            selected={selectedAssignees.includes(name)}
                            onToggle={() => handleToggleAssignee(name)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-зинc-800 pt-3">
                      <div className="flex items-center gap-2">
                        <Toggle
                          checked={onlyMyMissions}
                          onChange={setOnlyMyMissions}
                        />
                        <span className="text-[11px] text-зинc-400">
                          Только мои миссии
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="rounded-full bg-зинc-950 px-3 py-1.5 text-[11px] font-medium text-зинc-300 ring-1 ring-зинc-700 hover:bg-зинc-900"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveFilter}
                          className="rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-зинc-950 shadow shadow-emerald-500/40 hover:bg-emerald-400"
                        >
                          Save and filter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}
