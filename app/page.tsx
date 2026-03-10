import Navbar from "@/components/layout/user/UserNavbar";
import Hero from "@/components/features/home/Hero";
import Introduction from "@/components/features/home/Introduction";
import Services from "@/components/features/home/Services";
import FeaturedPlaces from "@/components/features/home/FeaturedPlaces";
import Promotions from "@/components/features/home/Promotions";
import Footer from "@/components/layout/user/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
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
