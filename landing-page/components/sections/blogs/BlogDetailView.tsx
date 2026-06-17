"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import CtaFlowLink from "@/components/ui/cta-flow/CtaFlowLink";
import Heading from "@/components/ui/heading/Heading";
import SubHeading from "@/components/ui/subheading/SubHeading";
import blogAuthor from "@/assets/images/blog/blog-author.png";
import type { BlogPost } from "@/lib/blogs-api";
import {
  formatBlogDate,
  getBlogCoverImage,
  getBlogExcerpt,
} from "@/lib/blog-utils";
import BlogCoverImage from "./BlogCoverImage";

type BlogDetailViewProps = {
  post: BlogPost;
};

function MetaDot() {
  return (
    <span
      className="h-1 w-1 shrink-0 rounded-full bg-[#D9D9D9]"
      aria-hidden
    />
  );
}

const blogPillButtonClassName =
  "inline-flex w-fit items-center gap-2 rounded-full bg-[#151032] px-4 py-2 text-sm font-medium text-white shadow-[inset_0px_1.41px_3.18px_0px_rgba(255,255,255,0.5)] transition hover:bg-[#1a1440] sm:text-base";

export default function BlogDetailView({ post }: BlogDetailViewProps) {
  const { t, i18n } = useTranslation("translation", { keyPrefix: "blogs" });
  const author = t("detail.defaultAuthor");
  const detailDate = formatBlogDate(post.createdAt, i18n.language);
  const excerpt = getBlogExcerpt(post.content);
  const coverImage = getBlogCoverImage(post);

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 sm:gap-10 sm:px-6 lg:px-8">
      <CtaFlowLink
        href="/blogs"
        label={t("detail.backToBlogs")}
        leadingIcon
        arrowClassName="h-3.5 w-3.5 sm:h-4 sm:w-4"
        className={blogPillButtonClassName}
      />

      <article className="page-content-stack">
        <header className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full sm:h-9 sm:w-9">
              <Image
                src={blogAuthor}
                alt={author}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="page-content-desc text-left">{author}</span>
              <MetaDot />
              <time
                className="page-content-desc text-left"
                dateTime={post.createdAt}
              >
                {detailDate}
              </time>
              <MetaDot />
              <span className="inline-flex items-center justify-center rounded-full bg-[#151032] px-2.5 py-1 text-xs font-medium text-white shadow-[inset_0px_1.41px_3.18px_0px_rgba(255,255,255,0.5)] sm:px-3 sm:py-1.5 sm:text-sm">
                {t("page.defaultCategory")}
              </span>
            </div>
          </div>

          <div className="page-hero-stack">
            <Heading
              as="h1"
              variant="page-hero"
              align="left"
              text={post.title}
            />
            {excerpt ? (
              <SubHeading variant="page-hero" align="left" text={excerpt} />
            ) : null}
          </div>
        </header>

        {coverImage ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:rounded-3xl">
            <BlogCoverImage
              src={coverImage}
              alt={post.title}
              priority
              className="object-cover"
              sizes="(max-width: 960px) 100vw, 960px"
            />
          </div>
        ) : null}

        <div
          className="blog-prose text-left text-[#C7CCD2]"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content),
          }}
        />
      </article>
    </div>
  );
}
