import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import AppIcon from "@/components/ui/app-icon";

export type SelectDropdownOption<T extends string> = {
  value: T;
  label: string;
};

type SelectDropdownProps<T extends string> = {
  value: T;
  options: SelectDropdownOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
};

export default function SelectDropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
  triggerClassName,
  disabled = false,
}: SelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectOption = (nextValue: T) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-left text-sm text-white outline-none transition-colors hover:border-white/15 hover:bg-white/[0.05] focus:border-white/20 disabled:cursor-not-allowed disabled:opacity-60",
          triggerClassName,
        )}
      >
        <span className="truncate">{selected?.label ?? value}</span>
        <AppIcon
          name="chevron-down"
          className={cn(
            "h-4 w-4 text-secondary-text transition-transform",
            open && "rotate-180",
          )}
          strokeWidth={2}
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-white/[0.12] bg-[#0d082b] py-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectOption(option.value)}
                  className={cn(
                    "flex w-full cursor-pointer px-4 py-2.5 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-tab-active/15 text-white"
                      : "text-feature-text hover:bg-white/[0.06] hover:text-white",
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
