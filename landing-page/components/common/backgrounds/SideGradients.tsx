import Image from 'next/image'
import PtaGrad from '@/assets/images/gradients/pta-gradient.png'

export default function SideGradients() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      <Image
        src={PtaGrad}
        alt=""
        className="horn-glow-pulse absolute left-[-280px] top-[70%] max-w-[552px] -translate-y-1/2 rotate-180 opacity-60"
      />

      <Image
        src={PtaGrad}
        alt=""
        className="horn-halo-pulse absolute right-[-280px] top-[70%] max-w-[552px] -translate-y-1/2 opacity-60"
      />
    </div>
  )
}
