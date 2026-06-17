"use client";

import Badge from "@/components/ui/badge/Badge";
import SectionTitleWrap from "@/components/ui/heading/Sectiontitlewrap";
import { useTranslation } from "react-i18next";

export default function ContactHero() {
  const { t } = useTranslation("translation", {
    keyPrefix: "contactPage",
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
      <div className="badge-wrap flex flex-col gap-2">
        <Badge text={t("badge")} />
      </div>

      <SectionTitleWrap heading={t("title")} subheading={t("description")} />
    </div>
  );
}
