import Image from 'next/image'
import FooterGradient from '@/assets/images/gradients/footer-gradient.png'

const FooterBackground = () => {
  return (
    <div
      className="
        absolute
        inset-0
        pointer-events-none
        overflow-hidden
      "
    >
      <Image
        src={FooterGradient}
        alt=""
        className="
          absolute
          bottom-0
          left-1/2
          -translate-x-1/2
          w-full
          opacity-40
          select-none
        "
      />
    </div>
  )
}

export default FooterBackground