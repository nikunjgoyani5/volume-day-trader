import type { ReactNode } from "react";

import AuthGradientLayer from "@/components/auth/AuthGradientLayer";
import VdltraLogo from "@/components/auth/VdltraLogo";
import { FEATURE_PILLS } from "@/styles/auth.styles";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  hideHeader?: boolean;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  hideHeader = false,
}: AuthLayoutProps) {
  return (
    <div className="auth-shell flex min-h-svh min-h-dvh flex-col">
      <AuthGradientLayer />

      <header className="relative z-10 shrink-0 px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
        <VdltraLogo />
      </header>

      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">
        <section className="hidden flex-1 flex-col justify-center px-8 py-10 lg:flex xl:px-16 2xl:px-20">
          <p className="mb-4 inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#1D1938] bg-pill-bg px-3 py-1.5 text-xs font-medium text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]">
            <span className="rounded-2xl bg-pill-inner px-2 py-0.5 text-xs tracking-wide text-white">
              Admin
            </span>
            <span className="truncate">Volume Day Trader Platform</span>
          </p>

          <h1 className="max-w-xl text-3xl font-semibold leading-[1.1] tracking-tight text-white xl:text-5xl 2xl:text-[3.25rem]">
            Stop Guessing. Start{" "}
            <span className="text-tab-active">Trading</span> With Confidence.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-secondary-text">
            Manage users, subscriptions, analytics, and platform settings from
            one secure admin dashboard.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2 xl:mt-10 xl:gap-2.5">
            {FEATURE_PILLS.map((label) => (
              <li key={label}>
                <span className="inline-flex items-center gap-2 rounded-full bg-pill-bg px-3 py-2 text-sm text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-tab-active"
                    aria-hidden
                  />
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:py-10 lg:px-10 lg:py-12 xl:px-16">
          <div className="w-full max-w-md">
            <div
              className={`rounded-2xl border border-card-border/80 bg-card-bg/90 shadow-[var(--shadow-card-inset)] backdrop-blur-sm ${
                hideHeader
                  ? "px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12"
                  : "p-5 sm:p-6 md:p-8"
              }`}
            >
              {!hideHeader && (
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-text sm:text-base">
                    {subtitle}
                  </p>
                </div>
              )}

              {children}
            </div>

            {footer !== null &&
              (footer ?? (
                <p className="mt-4 px-1 text-center text-[11px] leading-relaxed text-muted-text sm:mt-6 sm:px-2 sm:text-xs">
                  Professional volume indicators and structured market insights
                  for smarter trading decisions.
                </p>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
