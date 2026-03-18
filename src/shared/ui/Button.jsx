import { classNames } from "./classNames";

const VARIANTS = {
  solid: "bg-zinc-900 text-zinc-200 ring-1 ring-zinc-700/80 hover:bg-zinc-800",
  primary:
    "bg-emerald-500 text-zinc-950 shadow shadow-emerald-500/40 hover:bg-emerald-400",
  ghost:
    "bg-transparent text-zinc-200 hover:bg-zinc-900/60 ring-1 ring-zinc-700/80",
};

const SIZES = {
  sm: "h-8 px-3 text-[11px]",
  md: "h-9 px-4 text-xs",
};

export function Button({
  variant = "solid",
  size = "sm",
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={classNames(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}

