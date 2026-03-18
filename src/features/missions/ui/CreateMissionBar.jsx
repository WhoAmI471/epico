import { classNames, IconButton } from "../../../shared/ui";
import {
  PRIORITY_CONFIG_RU,
  PRIORITY_VISUAL,
  TYPE_CONFIG,
  LANES,
} from "../constants";
import { MissionTypeIcon } from "./MissionTypeIcon";

export function CreateMissionBar({
  draftTitle,
  setDraftTitle,
  onCreate,
  showConfigurator,
  setShowConfigurator,
  draftType,
  setDraftType,
  draftPriority,
  setDraftPriority,
  draftLane,
  setDraftLane,
}) {
  return (
    <div className="relative flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-zinc-950/70 px-4 py-2.5 ring-1 ring-zinc-800/90">
      <IconButton
        size="sm"
        variant="solid"
        onClick={() => setShowConfigurator((value) => !value)}
        title="Настроить тип и статус создаваемой миссии"
      >
        +
      </IconButton>

      <input
        type="text"
        className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
        placeholder="Add mission"
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.target.value)}
      />

      <IconButton
        size="sm"
        variant="primary"
        onClick={onCreate}
        title="Создать миссию"
      >
        +
      </IconButton>

      {showConfigurator && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl bg-zinc-950 p-3 text-xs text-zinc-200 shadow-xl ring-1 ring-zinc-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              Новая миссия
            </span>
            <button
              type="button"
              onClick={() => setShowConfigurator(false)}
              className="rounded-full px-2 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-900"
            >
              Закрыть
            </button>
          </div>

          <div className="mb-3">
            <p className="mb-1 text-[11px] font-medium text-zinc-300">Тип</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDraftType(key)}
                  className={classNames(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                    draftType === key
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

          <div className="mb-3">
            <p className="mb-1 text-[11px] font-medium text-zinc-300">
              Приоритет
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["lowest", "low", "medium", "high", "highest"].map((key) => {
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
                    <span>{PRIORITY_CONFIG_RU[key]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-1 text-[11px] font-medium text-zinc-300">
              Статус (колонка)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {LANES.map((lane) => (
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
  );
}

