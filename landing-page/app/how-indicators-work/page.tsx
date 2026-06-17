"use client";

import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer/Footer";
import Container from "@/components/layout/container/Container";
import BlogPageBackground from "@/components/sections/blogs/BlogPageBackground";
import HowIndicatorsWorkContent from "@/components/sections/how-indicators-work/HowIndicatorsWorkContent";
import HowIndicatorsWorkHero from "@/components/sections/how-indicators-work/HowIndicatorsWorkHero";

export default function HowIndicatorsWorkPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden pt-28 md:pt-32 lg:pt-36">
      <BlogPageBackground />

      <Container>
        <Navbar />
      </Container>

      <section className="relative z-10">
        {/* <Container> */}
          <HowIndicatorsWorkHero />
        {/* </Container> */}

        {/* <Container> */}
          <div className="mx-auto mt-20 w-full max-w-[920px] pb-24 md:pb-32">
            <HowIndicatorsWorkContent />
          </div>
        {/* </Container> */}
      </section>

      {/* <Footer /> */}
    </div>
  );
}
