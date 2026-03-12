"use client";

import { Anchor, Mountain, Landmark, Users, Zap, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const tourPackages = [
  {
    icon: Anchor,
    title: "Tour Biển Đảo",
    description: "Khám phá những bãi biển tuyệt đẹp và đảo hoang sơ tại Việt Nam.",
    locations: ["Phú Quốc", "Nha Trang", "Đà Nẵng", "Phú Yên"],
    price: "Từ 2.990.000đ",
    badge: "Hot",
    badgeColor: "bg-red-500",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  },
  {
    icon: Mountain,
    title: "Tour Miền Núi",
    description: "Trải nghiệm văn hóa độc đáo và khí hậu mát mẻ của vùng núi phía Bắc.",
    locations: ["Sapa", "Đà Lạt", "Mộc Châu", "Pleiku"],
    price: "Từ 3.490.000đ",
    badge: null,
    badgeColor: null,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
  },
  {
    icon: Landmark,
    title: "Tour Di Tích Lịch Sử",
    description: "Khám phá các di sản văn hóa thế giới và di tích lịch sử nổi tiếng.",
    locations: ["Huế", "Hội An", "Mỹ Sơn", "Cần Thơ"],
    price: "Từ 2.590.000đ",
    badge: null,
    badgeColor: null,
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80",
  },
  {
    icon: Users,
    title: "Tour Gia Đình",
    description: "Lịch trình nhẹ nhàng, phù hợp mọi lứa tuổi với ưu tiên an toàn.",
    locations: ["VinWonders", "FLC", "Sun World"],
    price: "Từ 4.990.000đ",
    badge: "Family",
    badgeColor: "bg-green-500",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
  },
  {
    icon: Zap,
    title: "Tour Mạo Hiểm",
    description: "Trải nghiệm cảm giác mạnh với leo núi, lặn biển, khám phá hang động.",
    locations: ["Phong Nha", "Cúc Phương", "Nha Trang", "Phú Quốc"],
    price: "Từ 5.490.000đ",
    badge: "Adventure",
    badgeColor: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=600&q=80",
  },
];

export default function TourPackages() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Tour Trọn Gói
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trải Nghiệm Trọn Vẹn - <span className="text-orange-500">Không Lo Phiền Toái</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Các gói tour của Karnel Travels được thiết kế tỉ mỉ để mang đến trải nghiệm hoàn hảo nhất.
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tourPackages.map((tour, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url('${tour.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Badge */}
                {tour.badge && (
                  <div className={`absolute top-4 left-4 ${tour.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {tour.badge}
                  </div>
                )}

                {/* Icon */}
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <tour.icon className="w-6 h-6 text-white" />
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4 text-right">
                  <div className="text-white font-bold text-lg">{tour.price}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {tour.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {tour.description}
                </p>

                {/* Locations */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.locations.map((location, idx) => (
                    <span 
                      key={idx} 
                      className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {location}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-gray-500 text-sm ml-2">(128 đánh giá)</span>
                </div>

                {/* CTA */}
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:gap-3 transition-all"
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105"
          >
            Xem Tất Cả Tour
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
