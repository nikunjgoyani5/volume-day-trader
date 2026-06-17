import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import VdltraLogo from "@/components/auth/VdltraLogo";
import AppIcon from "@/components/ui/app-icon";
import { DASHBOARD_NAV, type DashboardNavEntry } from "@/constants/dashboard.nav";

import NavIcon from "./NavIcon";

type DashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
};

function isGroupActive(
  entry: Extract<DashboardNavEntry, { type: "group" }>,
  pathname: string,
) {
  return entry.children.some(
    (c) => pathname === c.path || pathname.startsWith(`${c.path}/`),
  );
}

export default function DashboardSidebar({
  open,
  onClose,
}: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      for (const entry of DASHBOARD_NAV) {
        if (entry.type === "group") {
          initial[entry.label] = isGroupActive(entry, pathname);
        }
      }
      return initial;
    },
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`fixed inset-0 z-40 cursor-pointer bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-svh max-h-svh w-[min(100vw-2rem,18rem)] flex-col border-r border-card-border bg-card-bg transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-svh lg:max-h-svh lg:w-72 lg:shrink-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="shrink-0 border-b border-card-border px-3 py-4">
          <VdltraLogo compact />
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {DASHBOARD_NAV.map((entry) => {
            if (entry.type === "link") {
              return (
                <NavLink
                  key={entry.path}
                  to={entry.path}
                  end={entry.path === "/dashboard"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-tab-active text-white shadow-[var(--shadow-control-inset)]"
                        : "text-secondary-text hover:bg-pill-bg hover:text-white",
                    ].join(" ")
                  }
                >
                  <NavIcon name={entry.icon} />
                  <span>{entry.label}</span>
                </NavLink>
              );
            }

            const isOpen = expandedGroups[entry.label] ?? false;
            const groupActive = isGroupActive(entry, pathname);

            return (
              <div key={entry.label} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(entry.label)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    groupActive
                      ? "bg-white/[0.04] text-white"
                      : "text-secondary-text hover:bg-pill-bg hover:text-white"
                  }`}
                >
                  <NavIcon name={entry.icon} />
                  <span className="flex-1 text-left">{entry.label}</span>
                  <AppIcon
                    name="chevron-down"
                    className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={2}
                  />
                </button>

                {isOpen && (
                  <div className="ml-3 space-y-0.5 border-l border-white/[0.08] pl-3">
                    {entry.sectionLabel && (
                      <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-secondary-text">
                          {entry.sectionLabel}
                        </span>
                        {entry.sectionBadge && (
                          <span className="shrink-0 rounded-full bg-tab-active/20 px-2 py-0.5 text-xs font-semibold text-tab-active shadow-[0_0_12px_rgb(237_31_36/0.35)]">
                            {entry.sectionBadge}
                          </span>
                        )}
                      </div>
                    )}

                    {entry.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        end={child.path === "/dashboard/blogs"}
                        onClick={onClose}
                        className={({ isActive }) =>
                          [
                            "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-tab-active text-white shadow-[0_0_16px_rgb(237_31_36/0.35)]"
                              : "text-secondary-text hover:bg-pill-bg hover:text-white",
                          ].join(" ")
                        }
                      >
                        <NavIcon name={child.icon} className="h-4 w-4" />
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-card-border px-4 py-4">
          <p className="text-xs text-muted-text">Volume Day Trader Admin</p>
        </div>
      </aside>
    </>
  );
}
