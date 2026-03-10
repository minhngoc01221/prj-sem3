import Header from "@/components/layout/Header";
import Hero from "@/features/home/Hero";
import Introduction from "@/features/home/Introduction";
import Services from "@/features/home/Services";
import FeaturedPlaces from "@/features/home/FeaturedPlaces";
import Promotions from "@/features/home/Promotions";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Introduction />
        <Services />
        <FeaturedPlaces />
        <Promotions />
      </main>
      <Footer />
    </>
  );
}
