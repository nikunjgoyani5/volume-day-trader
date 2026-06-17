import Image from "next/image";
import blogPageBg from "@/assets/images/blog/blog-page-bg.png";
import PtaGrad from "@/assets/images/gradients/pta-gradient.png";

export default function BlogPageBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url(${blogPageBg.src})`,
          backgroundRepeat: "repeat",
          backgroundSize: "1024px 1024px",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-[60px] min-h-[289px] overflow-visible"
        aria-hidden
      >
        {/* <Image
          src={PtaGrad}
          alt=""
          width={711}
          height={289}
          className="absolute left-0 top-0 max-w-none opacity-80"
        /> */}
        {/* <Image
          src={PtaGrad}
          alt=""
          width={711}
          height={289}
          className="absolute right-0 top-0 max-w-none rotate-180 opacity-80"
        /> */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#050024]" />
      </div>
    </>
  );
}
