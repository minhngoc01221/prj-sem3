import type { Metadata } from "next";
import PolicyLinks from "@/components/information/PolicyLinks";
import PromotionsSection from "@/components/information/PromotionsSection";
import HotDealsSection from "@/components/information/HotDealsSection";
import NewToursSection from "@/components/information/NewToursSection";

export const metadata: Metadata = {
  title: "Information - Special Offers & Policies | Karnel Travels",
  description: "View our latest promotions, hot deals, and new tour packages. Learn about our policies, payment methods, and frequently asked questions.",
  keywords: ["travel promotions", "tour deals", "hot deals", "new tours", "policy", "faq"],
};

export default function InformationPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative py-20 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" className="text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Information Center
            </h1>
            <p className="text-xl text-white/90">
              Find the best deals, latest promotions, and all the information you need for your perfect trip.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Links Section (F049, F055) */}
      <PolicyLinks />

      {/* Promotions Section (F050, F053, F054) */}
      <PromotionsSection />

      {/* Hot Deals Section (F051) */}
      <HotDealsSection />

      {/* New Arrivals Section (F052) */}
      <NewToursSection />

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our tours and find your perfect getaway. Book now to enjoy exclusive offers!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tours"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition-colors"
            >
              Browse All Tours
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
