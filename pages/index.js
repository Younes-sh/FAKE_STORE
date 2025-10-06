// pages/index.js
import Head from "next/head";
import Hero from "@/Components/HomePage/Hero";
import Collections from "@/Components/HomePage/Collections/";
import WhyChooseUs from "@/Components/HomePage/WhyChooseUs/";
import ProductsShowcase from "@/Components/HomePage/ProductsShowcase/";
import Testimonials from "@/Components/HomePage/Testimonials/";
// Carousel
import Carousel from "@/Components/Carousel/Slider.jsx";
// Footer
import Footer from "@/Components/Footer";



export default function Home() {
  return (
    <>
      <Head>
        <title>Luxury Jewelry | Premium Collections</title>
        <meta name="description" content="Discover our exclusive jewelry collections crafted with precision and elegance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Hero />
        <Collections />
        <Carousel />
        <WhyChooseUs />
        <ProductsShowcase />
        <Testimonials />
        <Footer />
      </main>
    </>
  );
}
