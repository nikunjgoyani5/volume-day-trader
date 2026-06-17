import React from 'react'

const Container = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="w-full max-w-[1920px] mx-auto xl:px-40 px-4 overflow-x-clip">
      {children}
    </div>
  )
}

export default Container
