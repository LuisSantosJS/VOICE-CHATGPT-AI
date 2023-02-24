import React, { useEffect } from 'react';
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(import("../components/main"), {
  ssr: false,
})
export default DynamicHeader;