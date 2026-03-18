import { classNames, Button, TextInput } from "../../../shared/ui";
import { LANES, PRIORITY_LABEL_EN, PRIORITY_VISUAL, TYPE_CONFIG } from "../constants";
import { MissionTypeIcon } from "./MissionTypeIcon";

export function MissionDetailsPanel({
  mission,
  allAssignees,
  onBackToFilters,
  onChangeField,
  onSave,
}) {
  if (!mission) return null;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-50">Mission details</h2>
          <p className="text-[11px] text-zinc-500">
            Редактируйте выбранную миссию и сохраните изменения.
          </p>
        </div>
        <Button variant="solid" size="sm" onClick={onBackToFilters}>
          К фильтрам
        </Button>
      </div>

      <div className="space-y-4 rounded-xl bg-zinc-950/80 p-3.5 ring-1 ring-zinc-900">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">
            Название миссии
          </label>
          <TextInput
            value={mission.title}
            onChange={(e) => onChangeField("title", e.target.value)}
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
                onClick={() => onChangeField("type", key)}
                className={classNames(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                  mission.type === key
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
          <p className="mb-1.5 text-xs font-medium text-zinc-300">Priority</p>
          <div className="grid grid-cols-3 gap-1.5">
            {["lowest", "low", "medium", "high", "highest"].map((key) => {
              const visual = PRIORITY_VISUAL[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onChangeField("priority", key)}
                  className={classNames(
                    "inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium ring-1 transition-colors",
                    mission.priority === key
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

        <div>
          <p className="mb-1.5 text-xs font-medium text-zinc-300">Колонка</p>
          <div className="flex flex-wrap gap-1.5">
            {LANES.map((lane) => (
              <button
                key={lane}
                type="button"
                onClick={() => onChangeField("lane", lane)}
                className={classNames(
                  "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                  mission.lane === lane
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
            <p className="mb-1 text-[11px] font-medium text-zinc-300">Дата</p>
            <TextInput
              type="date"
              value={mission.date}
              onChange={(e) => onChangeField("date", e.target.value)}
            />
          </div>
          <div>
            <p className="mb-1 text-[11px] font-medium text-zinc-300">Время</p>
            <TextInput
              type="time"
              value={mission.time}
              onChange={(e) => onChangeField("time", e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-300">Assignee</p>
            <button
              type="button"
              onClick={() =>
                onChangeField("assignee", allAssignees[0] ?? mission.assignee)
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
                onClick={() => onChangeField("assignee", name)}
                className={classNames(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                  mission.assignee === name
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
          <Button variant="primary" size="sm" onClick={onSave}>
            Save changes
          </Button>
        </div>
      </div>
    </>
  );
}

