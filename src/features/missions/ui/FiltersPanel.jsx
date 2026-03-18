import {
  classNames,
  Button,
  TagButton,
  TextInput,
  Toggle,
} from "../../../shared/ui";
import {
  FILTER_PRESETS,
  LANES,
  PRIORITY_LABEL_EN,
  PRIORITY_VISUAL,
  TYPE_CONFIG,
} from "../constants";
import { MissionTypeIcon } from "./MissionTypeIcon";

export function FiltersPanel({
  open,
  onToggleOpen,
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
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-50">Filters</h2>
          <p className="text-[11px] text-zinc-500">
            Настройте отображение миссий по нужным критериям.
          </p>
        </div>
        <Button variant="solid" size="sm" onClick={onToggleOpen}>
          {open ? "Скрыть" : "Показать"}
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTER_PRESETS.map((preset) => (
          <TagButton
            key={preset.id}
            active={filterPreset === preset.id}
            onClick={() => onApplyPreset(preset)}
          >
            {preset.label}
          </TagButton>
        ))}
      </div>

      {open && (
        <div className="space-y-4 rounded-xl bg-zinc-950/80 p-3.5 ring-1 ring-zinc-900">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-300">Name</span>
              <span className="text-[11px] text-zinc-500">Сохраняется локально</span>
            </div>
            <TextInput value={filterName} onChange={(e) => setFilterName(e.target.value)} />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-300">Mission type</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onToggleType(key)}
                  className={classNames(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                    selectedTypes[key]
                      ? "ring-emerald-400 bg-emerald-500/20 text-emerald-50"
                      : "ring-zinc-700 bg-zinc-950 text-zinc-300 hover:ring-zinc-500",
                  )}
                >
                  <MissionTypeIcon type={key} size="sm" />
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-300">Колонка (статус)</p>
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
              {LANES.map((lane) => (
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
            <p className="mb-1.5 text-xs font-medium text-zinc-300">Priority</p>
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
              {["lowest", "low", "medium", "high", "highest"].map((key) => {
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
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="mb-1 text-[11px] font-medium text-zinc-300">From</p>
              <TextInput type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-medium text-zinc-300">To</p>
              <TextInput type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-300">Assignee</p>
              <button
                type="button"
                onClick={onToggleAssigneesAll}
                className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300"
              >
                {selectedAssignees.length ? "Сбросить" : "Выбрать всех"}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allAssignees.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => onToggleAssignee(name)}
                  className={classNames(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                    selectedAssignees.includes(name)
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

          <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
            <div className="flex items-center gap-2">
              <Toggle checked={onlyMyMissions} onChange={setOnlyMyMissions} />
              <span className="text-[11px] text-zinc-400">Только мои миссии</span>
            </div>
            <div className="flex gap-2">
              <Button variant="solid" size="sm" onClick={onReset}>
                Reset
              </Button>
              <Button variant="primary" size="sm" onClick={onSave}>
                Save and filter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

