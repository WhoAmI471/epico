"use client";

import { useEffect, useRef, useState } from "react";
import { classNames } from "../../../shared/ui";

/* ── Type shape icons matching Figma design ── */
const TYPE_OPTIONS = [
  { key: "feature",  label: "Feature" },
  { key: "research", label: "Research" },
  { key: "task",     label: "Task" },
];

function TypeShape({ type, size = 10 }) {
  if (type === "feature") {
    return (
      <span
        className="inline-block flex-shrink-0"
        style={{ width: size, height: size, background: "#8b5cf6", borderRadius: 2 }}
      />
    );
  }
  if (type === "research") {
    return (
      <span
        className="inline-block flex-shrink-0 rounded-full"
        style={{ width: size, height: size, background: "#38bdf8" }}
      />
    );
  }
  if (type === "task") {
    return (
      <span
        className="inline-block flex-shrink-0"
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid #22c55e`,
        }}
      />
    );
  }
  return null;
}

/* ── Grid icon for idle state ── */
function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1" fill="#52525b" />
      <rect x="8" y="1" width="5" height="5" rx="1" fill="#52525b" />
      <rect x="1" y="8" width="5" height="5" rx="1" fill="#52525b" />
      <rect x="8" y="8" width="5" height="5" rx="1" fill="#52525b" />
    </svg>
  );
}

/**
 * CreateMissionBar — 3-step Figma flow:
 *  idle        → click → type-select
 *  type-select → pick type → name-input
 *  name-input  → press "+" or Enter → onCreate({ title, type })
 *
 * Props:
 *   onCreate({ title, type }) — called when user confirms
 */
export function CreateMissionBar({ onCreate }) {
  // "idle" | "type" | "name"
  const [step, setStep] = useState("idle");
  const [selectedType, setSelectedType] = useState(null);
  const [title, setTitle] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (step === "name") {
      // small delay so the DOM element mounts before focus
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [step]);

  function handleBarClick() {
    if (step === "idle") setStep("type");
  }

  function handleSelectType(key) {
    setSelectedType(key);
    setStep("name");
  }

  function handleCreate() {
    if (!title.trim()) return;
    onCreate?.({ title: title.trim(), type: selectedType ?? "task" });
    setTitle("");
    setSelectedType(null);
    setStep("idle");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleCreate();
    } else if (e.key === "Escape") {
      setTitle("");
      setSelectedType(null);
      setStep("idle");
    }
  }

  function handlePlusClick(e) {
    e.stopPropagation();
    if (step === "name") {
      handleCreate();
    } else {
      handleBarClick();
    }
  }

  const plusActive = step === "name" && title.trim().length > 0;

  return (
    <div className="px-4">
      <div
        className={classNames(
          /* Figma: border-radius 4px, padding 5px top/bottom, 8px left/right */
          "flex items-center gap-2 bg-[#1b1e23] px-2 py-[5px] ring-1 transition-colors",
          step === "idle"
            ? "cursor-pointer ring-white/[0.06] hover:ring-white/10"
            : "ring-white/[0.08]",
        )}
        style={{ borderRadius: 4 }}
        onClick={step === "idle" ? handleBarClick : undefined}
      >
        {/* Left icon — grid (idle/type) or type shape (name) */}
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center">
          {step === "name" && selectedType ? (
            <TypeShape type={selectedType} size={13} />
          ) : (
            <GridIcon />
          )}
        </div>

        {/* Middle content */}
        {step === "idle" && (
          <span className="flex-1 text-[13px] text-zinc-600 select-none">
            Add mission
          </span>
        )}

        {step === "type" && (
          <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-hide">
            {TYPE_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectType(key);
                }}
                style={{ borderRadius: 4 }}
                className="inline-flex flex-shrink-0 items-center gap-1.5 bg-white/[0.07] px-4 py-[10px] text-[12px] font-medium text-zinc-200 hover:bg-white/[0.12] transition-colors"
              >
                <TypeShape type={key} size={10} />
                {label}
              </button>
            ))}
          </div>
        )}

        {step === "name" && (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mission name…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
        )}

        {/* Right "+" button */}
        <button
          type="button"
          onClick={handlePlusClick}
          aria-label="Create mission"
          className={classNames(
            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[18px] font-light transition-colors",
            plusActive
              ? "bg-emerald-500 text-black hover:bg-emerald-400"
              : "text-zinc-500 hover:text-zinc-300",
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}
