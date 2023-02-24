import React, { useEffect } from 'react';
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(import("../components/main"), {
  ssr: false,
})

const App = () =>{
  useEffect(()=>{
    if(typeof window !== undefined){
      
      window.navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      .then((stream) => {
        //@ts-ignore
        window.localStream = stream; // A
          //@ts-ignore

        //window.localAudio.srcObject = stream; // B
          //@ts-ignore
        //window.localAudio.autoplay = true; // C
      console.log(stream)
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });
    }
  },[typeof window])
  return(
    <>
    <DynamicHeader/>
    </>
  )
}
export default App;