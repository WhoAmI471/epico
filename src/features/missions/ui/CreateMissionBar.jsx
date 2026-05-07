import { classNames } from "../../../shared/ui";
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
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      onCreate();
      setShowConfigurator(false);
    }
  }

  return (
    <div className="relative px-4">
      {/* Input row */}
      <div className="flex items-center gap-3 rounded-2xl bg-[#1a1a1f] px-3 py-2.5 ring-1 ring-white/[0.06]">
        {/* Configurator toggle */}
        <button
          type="button"
          onClick={() => setShowConfigurator((v) => !v)}
          title="Настроить новую миссию"
          className={classNames(
            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border text-base transition-colors",
            showConfigurator
              ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-400"
              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200",
          )}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 4h10M2 7h7M2 10h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <input
          type="text"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add mission"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
        />

        <button
          type="button"
          onClick={() => {
            onCreate();
            setShowConfigurator(false);
          }}
          aria-label="Создать миссию"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[15px] font-semibold text-black shadow hover:bg-emerald-400 transition-colors"
        >
          +
        </button>
      </div>

      {/* Configurator dropdown */}
      {showConfigurator && (
        <div className="absolute left-4 right-4 top-full z-30 mt-2 rounded-2xl bg-[#1a1a1f] p-4 ring-1 ring-white/[0.06] shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Новая миссия
            </span>
            <button
              type="button"
              onClick={() => setShowConfigurator(false)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300"
            >
              Закрыть
            </button>
          </div>

          {/* Type */}
          <div className="mb-3">
            <p className="mb-1.5 text-[11px] font-medium text-zinc-400">Тип</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDraftType(key)}
                  className={classNames(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                    draftType === key
                      ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                      : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
                  )}
                >
                  <MissionTypeIcon type={key} size="sm" />
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="mb-3">
            <p className="mb-1.5 text-[11px] font-medium text-zinc-400">Приоритет</p>
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
                        ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                        : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
                    )}
                  >
                    <span className={classNames("text-[10px]", visual?.color)}>
                      {visual?.icon}
                    </span>
                    {PRIORITY_CONFIG_RU[key]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lane */}
          <div>
            <p className="mb-1.5 text-[11px] font-medium text-zinc-400">Статус</p>
            <div className="flex flex-wrap gap-1.5">
              {LANES.map((lane) => (
                <button
                  key={lane}
                  type="button"
                  onClick={() => setDraftLane(lane)}
                  className={classNames(
                    "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                    draftLane === lane
                      ? "bg-emerald-500/20 ring-emerald-500/60 text-emerald-300"
                      : "bg-white/5 ring-white/10 text-zinc-300 hover:ring-white/20",
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
