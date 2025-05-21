import Head from "next/head";
import Header from "@/Components/HomePage/Header/Header";
import SectionOne from "@/Components/HomePage/Section1/SectionOne";
import Section2 from "@/Components/HomePage/Section2/Section2";
import Section3 from "@/Components/HomePage/Section3/Section3";
// Footer


export default function Home() {
  return (
    <div className="Home">
      <Head>
        <title>Fake Store</title>
        <meta name="description" content="Store gold silver watch" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" main">
        <Header />
        <SectionOne />
        <Section2 />
        <Section3 />

      </div>
    </div>
  );
}
