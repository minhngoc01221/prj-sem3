import Navbar from "@/components/layout/user/UserNavbar";
import Footer from "@/components/layout/user/Footer";
import AboutHero from "@/components/features/about/Hero";
import BrandStory from "@/components/features/about/BrandStory";
import TransportServices from "@/components/features/about/TransportServices";
import TourPackages from "@/components/features/about/TourPackages";
import ComboServices from "@/components/features/about/ComboServices";
import Destinations from "@/components/features/about/Destinations";
import GalleryAndAwards from "@/components/features/about/GalleryAndAwards";
import CTASection from "@/components/features/about/CTASection";

export const metadata = {
  title: "Giới thiệu - Karnel Travels",
  description: "Tìm hiểu về Karnel Travels - công ty du lịch và lữ hành hàng đầu Việt Nam. Chúng tôi kết nối du khách với những vùng đất tuyệt đẹp của Việt Nam.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <BrandStory />
        <TransportServices />
        <TourPackages />
        <ComboServices />
        <Destinations />
        <GalleryAndAwards />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
