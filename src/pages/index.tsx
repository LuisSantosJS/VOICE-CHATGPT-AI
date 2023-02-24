import React, { useEffect } from 'react';
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(import("../components/main"), {
  ssr: false,
})

const App = () =>{
  return(
    <DynamicHeader/>
  )
}
export default App;