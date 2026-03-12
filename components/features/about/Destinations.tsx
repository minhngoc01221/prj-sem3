"use client";

import { MapPin, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const regions = [
  {
    name: "Miền Bắc",
    description: "Từ Sapa huyền bí đến vịnh Hạ Long kỳ vĩ",
    color: "from-blue-500 to-cyan-500",
    spots: ["Hà Nội", "Hạ Long", "Sapa", "Ninh Bình", "Đà Lạt", "Mai Châu"],
    image: "https://images.unsplash.com/photo-1542640244-7e67286feb90?w=600&q=80",
    count: "15+ điểm",
  },
  {
    name: "Miền Trung",
    description: "Di sản Huế, Đà Nẵng hiện đại, Hội An cổ kính",
    color: "from-orange-500 to-red-500",
    spots: ["Huế", "Đà Nẵng", "Hội An", "Quy Nhơn", "Nha Trang", "Phú Yên"],
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80",
    count: "20+ điểm",
  },
  {
    name: "Miền Nam",
    description: "TP.HCM náo nhiệt, Phú Quốc thiên đường biển",
    color: "from-green-500 to-emerald-500",
    spots: ["TP.HCM", "Cần Thơ", "Phú Quốc", "Cà Mau", "Bến Tre", "Vũng Tàu"],
    image: "https://images.unsplash.com/photo-1534430480872-6c74c477a309?w=600&q=80",
    count: "25+ điểm",
  },
];

export default function Destinations() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Điểm Đến
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khám Phá <span className="text-orange-500">Khắp Việt Nam</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Từ Bắc đến Nam, chúng tôi đồng hành với bạn đến mọi vùng miền.
          </p>
        </div>

        {/* Regions Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {regions.map((region, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url('${region.image}')` }}
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${region.color} opacity-90 group-hover:opacity-80 transition-opacity`} />

              {/* Content */}
              <div className="relative h-[400px] p-6 flex flex-col justify-end text-white">
                {/* Count Badge */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {region.count}
                </div>

                {/* Region Name */}
                <h3 className="text-2xl font-bold mb-2">{region.name}</h3>

                {/* Description */}
                <p className="text-white/90 mb-4">{region.description}</p>

                {/* Spots List */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {region.spots.slice(0, 4).map((spot, idx) => (
                    <span 
                      key={idx} 
                      className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                    >
                      {spot}
                    </span>
                  ))}
                  {region.spots.length > 4 && (
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      +{region.spots.length - 4}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href="/spots"
                  className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all"
                >
                  Khám phá ngay
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Link
            href="/spots"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105"
          >
            Xem Tất Cả Điểm Đến
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
