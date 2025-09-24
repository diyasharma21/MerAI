import React, { Suspense } from 'react'
import {  DotLoader } from 'react-spinners'

const Layout = ({children}) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Suspense 
        fallback={<DotLoader className="mt-10"width={"100%"} color="pink" 
        cssOverride={{
            position: "fixed",
            top: "40%",
            left:"50"
        }} />}
      >
            {children}
      </Suspense>
    </div>
  )
}

export default Layout
