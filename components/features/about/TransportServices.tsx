"use client";

import { Bus, Car, Plane, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const transportServices = [
  {
    icon: Bus,
    title: "Xe Khách Liên Tỉnh",
    description: "Kết nối hơn 50 tuyến đường khắp cả nước với đội xe hiện đại, tiện nghi.",
    features: [
      "Kết nối 50+ tuyến đường",
      "WiFi, điều hòa, ghế ngả",
      "Đối tác: Phương Trang, Mai Linh",
    ],
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    icon: Car,
    title: "Xe Limousine Cao Cấp",
    description: "Trải nghiệm sang trọng với ghế da, chỗ để chân rộng và dịch vụ đón tiễn chuyên nghiệp.",
    features: [
      "Nội thất da cao cấp",
      "Dịch vụ đón tiễn sân bay",
      "Phù hợp doanh nhân, gia đình",
    ],
    color: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80",
  },
  {
    icon: Plane,
    title: "Vé Máy Bay Nội Địa",
    description: "Đặt vé trực tiếp với các hãng hàng không nội địa, hỗ trợ so sánh giá tốt nhất.",
    features: [
      "Vietnam Airlines, Vietjet, Bamboo",
      "So sánh giá nhanh chóng",
      "Miễn phí giao vé điện tử",
    ],
    color: "bg-teal-500",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
  },
];

export default function TransportServices() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Dịch Vụ Vận Chuyển
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Di Chuyển Thuận Tiện - <span className="text-orange-500">An Tâm Trên Mọi Nẻo Đường</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Với hệ thống vận chuyển đa dạng, Karnel Travels đảm bảo bạn luôn có phương tiện di chuyển phù hợp cho mọi hành trình.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {transportServices.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className={`absolute top-4 left-4 w-12 h-12 ${service.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/travel"
                  className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:gap-3 transition-all"
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
