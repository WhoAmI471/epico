import { PriorityIcon } from "./PriorityIcon";
import { LanePill } from "./LanePill";
import { MissionTypeIcon } from "./MissionTypeIcon";
import { classNames } from "../../../shared/ui";

export function MissionsList({ missions, selectedMissionId, onSelect }) {
  return (
    <div className="space-y-1.5 rounded-2xl bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 p-2 ring-1 ring-zinc-900">
      {missions.map((mission) => (
        <article
          key={mission.id}
          onClick={() => onSelect(mission.id)}
          className={classNames(
            "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-zinc-100 hover:bg-zinc-900/80",
            selectedMissionId === mission.id &&
              "ring-1 ring-emerald-500/60 bg-zinc-900",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <MissionTypeIcon type={mission.type} size="md" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-[13px] font-medium">
                  {mission.title}
                </p>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                <PriorityIcon priority={mission.priority} />
                <span>
                  {new Date(mission.date).toLocaleDateString("ru-RU")} ·{" "}
                  {mission.time}
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
      {missions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 px-6 py-10 text-center text-sm text-zinc-500">
          <p className="mb-1 font-medium">Миссии по текущим фильтрам не найдены</p>
          <p className="text-xs text-zinc-500">
            Измените параметры фильтра или создайте новую миссию.
          </p>
        </div>
      )}
    </div>
  );
}

