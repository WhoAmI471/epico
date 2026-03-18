import { classNames } from "./classNames";

export function TextInput({ className, ...props }) {
  return (
    <input
      className={classNames(
        "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600",
        "focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60",
        className,
      )}
      {...props}
    />
  );
}

