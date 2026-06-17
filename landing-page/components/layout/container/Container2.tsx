import React from 'react'
import Container from './Container'

const Container2 = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-0">
      {children}
    </div>
  )
}

export default Container2
