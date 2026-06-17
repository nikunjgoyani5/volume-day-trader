"use client";

import Badge from "@/components/ui/badge/Badge";
import Heading from "@/components/ui/heading/Heading";
import SubHeading from "@/components/ui/subheading/SubHeading";
import { useTranslation } from "react-i18next";

export default function HowIndicatorsWorkHero() {
  const { t } = useTranslation("translation", {
    keyPrefix: "howIndicatorsWork",
  });

  return (
    <div className="mx-auto w-full max-w-4xl text-center">
      <div className="badge-wrap flex flex-col gap-2">
        <Badge text={t("badge")} />
      </div>

      <div className="relative z-10 mx-auto section-header-stack">
        <Heading
          as="h1"
          variant="page-hero"
          align="center"
          className="mx-auto max-w-3xl px-1 sm:px-0"
          text={t("title")}
        />
        <SubHeading
          variant="page-hero"
          align="center"
          className="mx-auto max-w-[530px] px-2 sm:px-0"
          text={t("description")}
        />
      </div>
    </div>
  );
}
