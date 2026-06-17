"use client";

import Image, { type StaticImageData } from "next/image";
import { useTranslation } from "react-i18next";
import Heading from "@/components/ui/heading/Heading";
import SubHeading from "@/components/ui/subheading/SubHeading";
import { HOW_INDICATORS_BLOCKS } from "./howIndicatorsContent";

function ContentImage({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:rounded-3xl">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 920px) 100vw, 920px"
      />
    </div>
  );
}

function HeadingBody({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="page-content-block">
      <Heading as="h2" variant="page-content" align="left" text={title} />
      <SubHeading variant="page-content" align="left" text={body} />
    </div>
  );
}

function BodyParagraph({ body }: { body: string }) {
  return <SubHeading variant="page-content" align="left" text={body} />;
}

export default function HowIndicatorsWorkContent() {
  const { t } = useTranslation("translation", {
    keyPrefix: "howIndicatorsWork",
  });

  return (
    <div className="page-content-stack mx-auto w-full max-w-[920px]">
      {HOW_INDICATORS_BLOCKS.map((block, index) => {
        if (block.type === "headingBody") {
          return (
            <HeadingBody
              key={`${block.titleKey}-${index}`}
              title={t(block.titleKey)}
              body={t(block.bodyKey)}
            />
          );
        }

        if (block.type === "image") {
          return (
            <ContentImage
              key={`${block.altKey}-${index}`}
              src={block.image}
              alt={t(block.altKey)}
            />
          );
        }

        return (
          <BodyParagraph
            key={`${block.bodyKey}-${index}`}
            body={t(block.bodyKey)}
          />
        );
      })}
    </div>
  );
}
