"use client";

import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const inputClassName =
  "w-full min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-base text-white placeholder:text-secondary-text/50 focus:outline-none focus:ring-0 sm:text-lg";

const shellClassName =
  "flex h-12 w-full min-w-0 items-center gap-2 rounded-xl border border-card-border bg-[#151032] px-3 sm:h-[58px] sm:gap-3 sm:px-4";

const listClassName =
  "fixed z-[200] max-h-52 overflow-y-auto overscroll-contain rounded-xl border border-card-border bg-[#151032] py-1 shadow-lg [-webkit-overflow-scrolling:touch] sm:max-h-60";

function flagUrl(code: string, width = 20) {
  const iso = code.toLowerCase();
  return `https://flagcdn.com/w${width}/${iso}.png`;
}

function CountryFlag({
  code,
  className = "h-3.5 w-5 shrink-0 rounded-[2px] object-cover",
}: {
  code: string;
  className?: string;
}) {
  return (
    <img
      src={flagUrl(code)}
      srcSet={`${flagUrl(code, 40)} 2x`}
      alt=""
      width={20}
      height={15}
      className={className}
      loading="lazy"
    />
  );
}

type PhoneFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  country: CountryCode;
  nationalNumber: string;
  error?: string;
  onCountryChange: (country: CountryCode) => void;
  onNationalNumberChange: (value: string) => void;
};

export default function PhoneField({
  id,
  label,
  placeholder,
  country,
  nationalNumber,
  error,
  onCountryChange,
  onNationalNumberChange,
}: PhoneFieldProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 256 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const countries = useMemo(
    () => getCountries().sort((a, b) => a.localeCompare(b)),
    []
  );

  const callingCode = `+${getCountryCallingCode(country)}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 224),
    });
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    updateMenuPosition();

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) {
        return;
      }
      if (listRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  const stopScrollPropagation = (event: React.WheelEvent | React.TouchEvent) => {
    event.stopPropagation();
  };

  const countryList =
    open && mounted
      ? createPortal(
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Countries"
            data-lenis-prevent
            data-lenis-prevent-wheel
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
            className={listClassName}
            onWheel={stopScrollPropagation}
            onTouchMove={stopScrollPropagation}
          >
            {countries.map((code) => (
              <li key={code} role="option" aria-selected={code === country}>
                <button
                  type="button"
                  onClick={() => {
                    onCountryChange(code);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm text-white hover:bg-white/10 ${
                    code === country ? "bg-white/10" : ""
                  }`}
                >
                  <CountryFlag code={code} />
                  <span className="min-w-[2rem] font-medium">{code}</span>
                  <span className="text-secondary-text/80">
                    +{getCountryCallingCode(code)}
                  </span>
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )
      : null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5 sm:flex-1 sm:gap-2">
      <label
        htmlFor={id}
        className="text-left text-sm font-medium text-white sm:text-base lg:text-lg"
      >
        {label}
      </label>
      <div
        className={`${shellClassName} ${
          error ? "border-red-500/70 ring-1 ring-red-500/30" : ""
        }`}
      >
        <div className="relative shrink-0">
          <button
            ref={triggerRef}
            type="button"
            aria-label="Select country"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => {
              if (!open) {
                updateMenuPosition();
              }
              setOpen((value) => !value);
            }}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-1 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
          >
            <CountryFlag code={country} />
            <span className="text-[10px] text-secondary-text/70" aria-hidden>
              ▼
            </span>
          </button>
        </div>

        {countryList}

        <span className="shrink-0 text-base text-white sm:text-lg">{callingCode}</span>
        <input
          id={id}
          name={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={placeholder}
          value={nationalNumber}
          onChange={(event) =>
            onNationalNumberChange(event.target.value.replace(/[^\d\s-]/g, ""))
          }
          className={inputClassName}
        />
      </div>
      {error ? (
        <p className="text-left text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
