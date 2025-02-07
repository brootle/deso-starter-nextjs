import Head from "next/head";

// import dynamic from 'next/dynamic'
// const Template = dynamic(() => import("../components/Template"), { ssr: false });

import Template from "@/components/Template";

export default function Home() {
  return (
    <>
      <Head>
        <title>DeSo Template App</title>
        <meta name="description" content="Template of DeSo app in NextJS by @btrootle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Template />
    </>
  );
}
