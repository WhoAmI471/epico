import { LANE_CONFIG, PRIORITY_VISUAL } from "../constants";
import { classNames } from "../../../shared/ui";

function PriorityDot({ priority }) {
  const colors = {
    lowest: "bg-emerald-500",
    low: "bg-sky-500",
    medium: "bg-amber-400",
    high: "bg-rose-400",
    highest: "bg-rose-500",
  };
  const shapes = {
    lowest: "↓↓",
    low: "↓",
    medium: "−",
    high: "↑",
    highest: "↑↑",
  };
  const dotColor = colors[priority] || "bg-zinc-500";

  return (
    <span
      className={classNames(
        "flex-shrink-0 mt-0.5 h-2 w-2 rounded-full",
        dotColor,
      )}
    />
  );
}

function LaneBadge({ lane }) {
  const cfg = LANE_CONFIG[lane] || { bg: "bg-zinc-700", text: "text-white" };
  const shortNames = {
    "Backlog": "Backlog",
    "Research": "Research",
    "Development": "Developm.",
    "QA & Test": "QA & Test",
    "Business Analysis": "Business_Analysis",
  };

  return (
    <span
      className={classNames(
        "inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold leading-none whitespace-nowrap",
        cfg.bg,
        cfg.text,
      )}
    >
      {lane}
    </span>
  );
}

export function MissionsList({ missions, selectedMissionId, onSelect }) {
  if (missions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="mb-3 text-3xl opacity-30">( ᵔ ᴥ ᵔ )</span>
        <p className="text-sm font-medium text-zinc-400">Миссии не найдены</p>
        <p className="mt-1 text-xs text-zinc-600">
          Измените фильтр или создайте новую миссию
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/[0.04]">
      {missions.map((mission) => {
        const isSelected = selectedMissionId === mission.id;
        const dateStr = mission.date
          ? (() => {
              const d = new Date(mission.date);
              const day = String(d.getDate()).padStart(2, "0");
              const month = String(d.getMonth() + 1).padStart(2, "0");
              return `${day}.${month}`;
            })()
          : "";

        return (
          <article
            key={mission.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(mission.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelect(mission.id);
            }}
            className={classNames(
              "flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors",
              isSelected
                ? "bg-white/[0.06]"
                : "hover:bg-white/[0.03] active:bg-white/[0.06]",
            )}
          >
            {/* Priority dot */}
            <PriorityDot priority={mission.priority} />

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium leading-snug text-zinc-100">
                {mission.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                {dateStr && <span>{dateStr}</span>}
                {mission.assignee && (
                  <span className="text-zinc-500">{mission.assignee}</span>
                )}
              </div>
            </div>

            {/* Lane badge */}
            <LaneBadge lane={mission.lane} />
          </article>
        );
      })}
    </div>
  );
}
