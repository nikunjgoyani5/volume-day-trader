"use client";

import { useRef, useState } from "react";
import { useFaqStackReveal } from "@/components/ui/motion/useFaqStackReveal";
import { Search, X } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import SectionTitleWrap from "@/components/ui/heading/Sectiontitlewrap";
// import Heading from "@/components/ui/heading/Heading";
// import SubHeading from "@/components/ui/subheading/SubHeading";
import FAQItem from "@/components/sections/faq/FAQItem";
import { useTranslation } from "react-i18next";

interface FAQData {
  key: "question1" | "question2" | "question3" | "question4" | "question5" | "question6";
}

export default function FAQ() {
  const { t } = useTranslation("translation");

  const QUESTIONS: FAQData[] = [
    { key: "question1" },
    { key: "question2" },
    { key: "question3" },
    { key: "question4" },
    { key: "question5" },
    { key: "question6" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const faqRevealRef = useRef<HTMLDivElement>(null);

  const filteredQuestions = QUESTIONS.filter((faq) => {
    const question = t(`faq.questions.${faq.key}.question`);
    const answer = t(`faq.questions.${faq.key}.answer`);
    const normalizedSearch = searchTerm.toLowerCase();
    return (
      question.toLowerCase().includes(normalizedSearch) ||
      answer.toLowerCase().includes(normalizedSearch)
    );
  });

  const filteredKeys = filteredQuestions.map((faq) => faq.key).join(",");

  useFaqStackReveal(faqRevealRef, {}, [filteredKeys]);

  return (
    <section id="faq" className="scroll-anchor-offset section-pb">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="badge-wrap flex flex-col gap-2">
          <Badge text={t("faq.badge")} />
        </div>

        {/* <div className="section-header-stack relative z-10 mx-auto">
          <Heading className="mx-auto max-w-3xl px-1 sm:px-0" text={t("faq.title")} />
          <SubHeading
            className="mx-auto max-w-2xl px-2 sm:px-0"
            text={t("faq.description")}
          />
        </div> */}
        <SectionTitleWrap
          heading={t("faq.title")}
          subheading={t("faq.description")}
        />
      </div>

      <div
        ref={faqRevealRef}
        className="content-pt mx-auto flex max-w-4xl flex-col items-center gap-6"
      >
        <div className="group relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center sm:left-4">
            <Search className="h-4 w-4 text-[#B8BDC9] transition-colors group-focus-within:text-white sm:h-5 sm:w-5" />
          </div>

          <input
            type="text"
            placeholder={t("faq.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-white/5 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white caret-white backdrop-blur-md transition-all duration-300 placeholder:text-secondary-text focus:border-white/20 focus:bg-white/10 focus:outline-none sm:py-3 sm:pl-12 sm:pr-12 sm:text-base"
          />

          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-3 z-10 flex cursor-pointer items-center text-secondary-text transition-colors hover:text-white sm:right-4"
              aria-label={t("faq.clearSearch")}
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex w-full max-w-3xl flex-col gap-3 overflow-visible sm:gap-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((faq) => (
              <div
                key={faq.key}
                data-faq-reveal
                className="origin-bottom will-change-transform"
              >
                <FAQItem
                  question={t(`faq.questions.${faq.key}.question`)}
                  answer={t(`faq.questions.${faq.key}.answer`)}
                />
              </div>
            ))
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-secondary-text sm:text-base">
                {t("faq.noResults", { searchTerm })}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
