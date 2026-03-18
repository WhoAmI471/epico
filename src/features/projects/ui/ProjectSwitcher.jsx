"use client";

import { classNames, Button, IconButton } from "../../../shared/ui";

export function ProjectSwitcher({
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onLeaveProject,
  leaveActionLabel,
}) {
  return (
    <div className="flex items-center gap-3">
      <select
        className={classNames(
          "h-9 rounded-full bg-zinc-900/60 px-3 text-xs text-zinc-200 ring-1 ring-zinc-700/80",
          "focus:outline-none focus:ring-1 focus:ring-emerald-500/60",
        )}
        value={currentProjectId || ""}
        onChange={(e) => onSelectProject(e.target.value)}
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>

      <IconButton
        size="md"
        variant="solid"
        aria-label={leaveActionLabel || "Leave / Delete project"}
        onClick={onLeaveProject}
        className="rounded-full"
      >
        <span className="text-[18px] leading-none font-semibold text-zinc-200">
          ×
        </span>
      </IconButton>

      <Button
        variant="solid"
        size="sm"
        className="rounded-full"
        onClick={onCreateProject}
      >
        + New
      </Button>
    </div>
  );
}

