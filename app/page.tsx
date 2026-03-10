import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import Services from "@/components/Services";
import FeaturedPlaces from "@/components/FeaturedPlaces";
import Promotions from "@/components/Promotions";
import Footer from "@/components/Footer";

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
