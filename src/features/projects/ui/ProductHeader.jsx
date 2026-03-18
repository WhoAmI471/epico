"use client";

import { classNames } from "../../../shared/ui";
import { ProjectSwitcher } from "./ProjectSwitcher";

export function ProductHeader({
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
}) {
  const currentProject = projects?.find((p) => p.id === currentProjectId);
  const members = currentProject?.members || [];

  function MemberAvatar({ member, index }) {
    const handle = String(member?.handle || member?.name || "@user");
    const key = handle.replace(/^@/, "").slice(0, 2).toUpperCase() || "U";
    const colors = [
      "from-sky-500 to-violet-500",
      "from-fuchsia-500 to-amber-400",
      "from-emerald-500 to-lime-400",
      "from-indigo-500 to-sky-400",
      "from-rose-500 to-orange-400",
    ];

    return (
      <span
        className={classNames(
          "inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white",
          "bg-gradient-to-tr border border-zinc-900/40",
          colors[index % colors.length],
        )}
        title={member?.name || handle}
      >
        {key}
      </span>
    );
  }

  return (
    <section className="mb-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">
          {currentProject?.title || "Untitled"}
        </h1>
        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-300 ring-1 ring-zinc-700/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          В работе
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {members.map((m, idx) => (
          <MemberAvatar key={m?.userId || idx} member={m} index={idx} />
        ))}
      </div>

      <p className="mt-2 text-xs text-zinc-400">
        Управление миссиями продукта, исследованиями и задачами.
      </p>

      {projects?.length ? (
        <div className="mt-3">
          <ProjectSwitcher
            projects={projects}
            currentProjectId={currentProjectId}
            onSelectProject={onSelectProject}
            onCreateProject={onCreateProject}
          />
        </div>
      ) : null}
    </section>
  );
}

