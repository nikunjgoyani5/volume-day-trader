import Image from 'next/image'

import TrustGrad from '@/assets/images/gradients/pta-gradient.png'


export default function TrustBackground() {
  return (

      <div className="absolute inset-0 pointer-events-none overflow-visible">

        <Image
          src={TrustGrad}
          alt=""
          className="horn-glow-pulse absolute left-[-380px] top-[75%] -translate-y-1/2 rotate-180 max-w-[552px] opacity-60"
        />

        <Image
          src={TrustGrad}
          alt=""
          className="horn-halo-pulse absolute right-[-380px] top-[75%] -translate-y-1/2 max-w-[552px] opacity-60"
        />

      </div>

  )
}