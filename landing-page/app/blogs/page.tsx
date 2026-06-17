"use client";

import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer/Footer";
import Container from "@/components/layout/container/Container";
import BlogPageBackground from "@/components/sections/blogs/BlogPageBackground";
import BlogPageSection from "@/components/sections/blogs/BlogPageSection";
import FAQ from "@/components/sections/faq/FAQ";

export default function BlogsPage() {
  return (
    <div className="relative mt-20 min-h-screen overflow-x-hidden ">
      <BlogPageBackground />

      {/* <Container> */}
        <Navbar />
      {/* </Container> */}

      <section className="relative z-10 pt-8 md:pt-12 lg:pt-16">
        {/* <Container> */}
          <BlogPageSection />
        {/* </Container> */}
      </section>

      <div className="relative z-10 overflow-y-hidden">
        {/* <Container> */}
          <FAQ />
        {/* </Container> */}
        {/* <Footer /> */}
      </div>
    </div>
  );
}
