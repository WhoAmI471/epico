import { classNames } from "./classNames";

const VARIANTS = {
  solid: "bg-zinc-900/80 ring-1 ring-zinc-700/80 hover:bg-zinc-800",
  primary:
    "bg-emerald-500 text-zinc-950 shadow shadow-emerald-500/40 hover:bg-emerald-400",
};

export function IconButton({
  variant = "solid",
  size = "md",
  className,
  type = "button",
  ...props
}) {
  const sizeClass = size === "sm" ? "h-8 w-8 rounded-lg" : "h-9 w-9 rounded-full";

  return (
    <button
      type={type}
      className={classNames(
        "inline-flex items-center justify-center transition-colors",
        sizeClass,
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}

