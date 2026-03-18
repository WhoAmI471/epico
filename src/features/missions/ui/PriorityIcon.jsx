import { PRIORITY_VISUAL } from "../constants";
import { classNames } from "../utils";

export function PriorityIcon({ priority }) {
  const visual = PRIORITY_VISUAL[priority];
  if (!visual) return null;

  return (
    <span className={classNames("text-[11px] leading-none", visual.color)}>
      {visual.icon}
    </span>
  );
}

