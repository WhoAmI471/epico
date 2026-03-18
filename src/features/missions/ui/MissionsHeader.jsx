import { classNames, IconButton } from "../../../shared/ui";

export function MissionsHeader() {
  return (
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
                index === 2 && "bg-gradient-to-tr from-emerald-500 to-lime-400",
                index === 3 && "bg-gradient-to-tr from-indigo-500 to-sky-400",
                index === 4 && "bg-gradient-to-tr from-rose-500 to-orange-400",
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
        <IconButton size="md" variant="solid" aria-label="Help">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-[13px] font-semibold">
            ?
          </span>
        </IconButton>
        <IconButton size="md" variant="solid" aria-label="User">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold">
            👤
          </span>
        </IconButton>
      </div>
    </header>
  );
}

