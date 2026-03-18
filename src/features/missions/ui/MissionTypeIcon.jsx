import { classNames } from "../utils";

export function MissionTypeIcon({ type, size = "md" }) {
  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-7 w-7";
  const circleSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const squareSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const triangle =
    size === "sm"
      ? "border-l-[8px] border-r-[8px] border-b-[12px]"
      : "border-l-[9px] border-r-[9px] border-b-[14px]";

  return (
    <span
      className={classNames(
        "inline-flex flex-none items-center justify-center text-[11px] text-zinc-100",
        sizeClass,
      )}
      aria-hidden="true"
    >
      {type === "research" && (
        <span className={classNames(circleSize, "rounded-full bg-sky-500")} />
      )}
      {type === "feature" && (
        <span className={classNames(squareSize, "bg-violet-500")} />
      )}
      {type === "task" && (
        <span
          className={classNames(
            "h-0 w-0",
            triangle,
            "border-l-transparent border-r-transparent border-b-emerald-400",
          )}
        />
      )}
    </span>
  );
}

