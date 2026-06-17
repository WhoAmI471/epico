import { LANE_CONFIG, PRIORITY_VISUAL } from "../constants";
import { classNames } from "../../../shared/ui";
import { MissionTypeIcon } from "./MissionTypeIcon";
import Image from "next/image";

function LaneBadge({ lane }) {
  const cfg = LANE_CONFIG[lane] || { bg: "bg-zinc-700", text: "text-white" };
  return (
    <span
      className={classNames(
        /* Figma: rounded pill, 10px font, semibold */
        "inline-flex flex-shrink-0 items-center rounded-[4px] px-2.5 py-[3px] text-[10px] font-semibold leading-none whitespace-nowrap",
        cfg.bg,
        cfg.text,
      )}
      
      style={{ fontFamily: "var(--font-roboto-mono)", fontWeight: 400 }}
    >
      {cfg.name}
    </span>
  );
}

export function MissionsList({ missions, selectedMissionId, onSelect }) {
  if (missions.length === 0) {
    return null;
  }

  return (
    /* Figma: items separated by thin divider, 12px gap between rows */
    <div>
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

        const priorityVisual = PRIORITY_VISUAL[mission.priority];

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
              /* Figma: row 347×41px, no vertical padding on row (height from content) */
              "flex cursor-pointer items-center gap-2 px-3.5 py-[6px] transition-colors",
              isSelected
                ? "bg-white/[0.06]"
                : "hover:bg-white/[0.03] active:bg-white/[0.06]",
            )}
          >
            {/* Type shape icon — Figma: circle / square / triangle, size sm */}
            <div className="flex-shrink-0 self-center pb-4">
              <MissionTypeIcon type={mission.type} />
            </div>

            {/* Content: title + secondary info */}
            <div className="min-w-0 flex-1">
              {/* Figma: title 17px, weight 400, line-height 19px */}
              <p className="truncate text-[17px] font-normal leading-[19px] text-white">
                {mission.title}
              </p>
              {/* Figma: secondary info — gap 10px between items, 11px text */}
              <div className="mt-1 flex items-center gap-[10px] text-[11px] text-zinc-500">
                {priorityVisual && (
                  <Image 
                    className={classNames("font-medium leading-none", priorityVisual.color)} 
                    src={priorityVisual.icon} 
                    width={18} 
                    height={18}
                    alt=""
                  />
                )}
                {dateStr && <span style={{ fontFamily: "var(--font-roboto-mono)", fontWeight: 400 }}>{dateStr}</span>}
                {mission.assignee && (
                  <span className="truncate" 
                    style={{ fontFamily: "var(--font-roboto-mono)", fontWeight: 400 }}>
                    {mission.assignee}
                  </span>
                )}
                {/* Lane badge — right, top-aligned */}
                <div className="self-center flex-shrink-0">
                  <LaneBadge lane={mission.lane} />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
