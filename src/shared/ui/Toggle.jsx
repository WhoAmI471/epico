import { classNames } from "./classNames";

export function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={classNames(
        "inline-flex h-6 w-11 items-center rounded-full border transition-colors",
        checked
          ? "border-emerald-500 bg-emerald-500/30"
          : "border-zinc-600 bg-zinc-900",
      )}
    >
      <span
        className={classNames(
          "ml-0.5 inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}

