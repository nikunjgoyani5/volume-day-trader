"use client";

import Link from "next/link";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer/Footer";
import Container from "@/components/layout/container/Container";
import BlogPageBackground from "@/components/sections/blogs/BlogPageBackground";
import { useTranslation } from "react-i18next";

export default function BlogNotFound() {
  const { t } = useTranslation("translation", { keyPrefix: "blogs.detail" });

  return (
    <div className="relative mt-20 min-h-screen overflow-x-hidden">
      <BlogPageBackground />
      {/* <Container> */}
        <Navbar />
        <div className="mx-auto flex max-w-[960px] flex-col items-center gap-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-white">{t("notFoundTitle")}</h1>
          <p className="text-lg text-secondary-text">{t("notFoundDescription")}</p>
          <Link
            href="/blogs"
            className="inline-flex items-center rounded-full bg-[#151032] px-6 py-3 text-lg text-white shadow-[inset_0px_1.41px_3.18px_0px_rgba(255,255,255,0.5)]"
          >
            {t("backToBlogs")}
          </Link>
        </div>
      {/* </Container> */}
      {/* <Footer /> */}
    </div>
  );
}
