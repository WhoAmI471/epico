import { classNames } from "./classNames";

export function TagButton({ active, className, ...props }) {
  return (
    <button
      type="button"
      className={classNames(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-emerald-400 bg-emerald-500/15 text-emerald-100"
          : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500",
        className,
      )}
      {...props}
    />
  );
}

