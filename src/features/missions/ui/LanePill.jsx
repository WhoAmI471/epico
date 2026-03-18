import { LANE_CONFIG } from "../constants";
import { classNames } from "../utils";

export function LanePill({ lane }) {
  const cfg = LANE_CONFIG[lane] || { bg: "bg-zinc-800", text: "text-zinc-100" };

  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium",
        cfg.bg,
        cfg.text,
      )}
    >
      {lane}
    </span>
  );
}

