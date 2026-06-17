"use client";

import { useEffect, useRef, useState } from "react";
import { classNames } from "../../../shared/ui";
import { MissionTypeIcon } from "./MissionTypeIcon";

/* ── Type shape icons matching Figma design ── */
const TYPE_OPTIONS = [
  { key: "feature",  label: "Feature" },
  { key: "research", label: "Research" },
  { key: "task",     label: "Task" },
];



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
            <MissionTypeIcon type={selectedType} />
          ) : (
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.5 11.7759H13.3931L8.94726 4.5L4.5 11.7759ZM12.0557 11.0259H5.8374L8.94581 5.93848L12.0557 11.0259Z" fill="#39772D"/>
              <path d="M20.0991 7.4956H22.2876V8.78028H20.0991V10.9673H18.8159V8.78028H16.6274V7.4956H18.8159V5.30859H20.0991V7.4956Z" fill="#898A8D"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M20.2749 14.2222C22.3132 14.4293 23.9032 16.1517 23.9032 18.2446L23.8829 18.6577C23.6757 20.6959 21.9546 22.2859 19.8618 22.2861L19.4487 22.2657C17.546 22.0726 16.0327 20.5604 15.8394 18.6577L15.8188 18.2446C15.8189 16.0122 17.6294 14.2018 19.8618 14.2017L20.2749 14.2222ZM16.5689 18.2446C16.5689 16.4264 18.0436 14.9518 19.8618 14.9517C21.68 14.9519 23.1532 16.4265 23.1532 18.2446C23.1531 20.0626 21.6798 21.5359 19.8618 21.5361C18.0437 21.5361 16.5691 20.0628 16.5689 18.2446Z" fill="#2F60BA"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12.5845 22.2861H5.30859V15.0103H12.5845V22.2861ZM11.8345 21.5361H6.05859V15.7603H11.8345V21.5361Z" fill="#9150AB"/>
            </svg>
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
                <MissionTypeIcon type={key} />
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
