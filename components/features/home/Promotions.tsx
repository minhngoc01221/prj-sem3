import Image from "next/image";
import { Calendar, ArrowRight, Flame } from "lucide-react";

const promotions = [
  {
    id: 1,
    title: "Tour Đà Nẵng - Hội An",
    subtitle: "3 Ngày 2 Đêm",
    description: "Khám phá Đà Nẵng và Hội An với giá ưu đãi",
    discount: "20%",
    originalPrice: "3.500.000₫",
    price: "2.800.000₫",
    duration: "3 ngày 2 đêm",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80",
    badge: "Giảm Giá",
    badgeType: "discount",
  },
  {
    id: 2,
    title: "Phú Quốc Paradise",
    subtitle: "4 Ngày 3 Đêm",
    description: "Trải nghiệm resort 5 sao tại đảo ngọc",
    discount: "25%",
    originalPrice: "8.500.000₫",
    price: "6.375.000₫",
    duration: "4 ngày 3 đêm",
    image: "https://images.unsplash.com/photo-1543489822-c49534f3271f?w=600&q=80",
    badge: "Hot Deal",
    badgeType: "hot",
  },
  {
    id: 3,
    title: "Sapa Express",
    subtitle: "2 Ngày 1 Đêm",
    description: "Tour Tây Bắc với ruộng bậc thang mùa lúa chín",
    discount: "15%",
    originalPrice: "2.200.000₫",
    price: "1.870.000₫",
    duration: "2 ngày 1 đêm",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80",
    badge: "Giảm Giá",
    badgeType: "discount",
  },
];

export default function Promotions() {
  return (
    <section id="promotions" className="py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Flame className="w-4 h-4" />
            Khuyến Mãi Đặc Biệt
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ưu Đãi <span className="text-orange-500">Hấp Dẫn</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Đặt ngay để nhận các ưu đãi độc quyền
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image with Badge */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold text-white ${
                  promo.badgeType === "hot" ? "bg-red-500" : "bg-orange-500"
                }`}>
                  {promo.badge}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-orange-500 font-bold">{promo.discount}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="text-orange-500 text-sm font-medium mb-1">{promo.subtitle}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {promo.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{promo.description}</p>
                
                {/* Duration */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{promo.duration}</span>
                  </div>
                </div>
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-gray-400 text-sm line-through">{promo.originalPrice}</span>
                    <div className="text-orange-500 font-bold text-xl">{promo.price}</div>
                  </div>
                  <a
                    href="#book-tour"
                    className="flex items-center gap-1 text-orange-500 font-medium hover:gap-2 transition-all"
                  >
                    Đặt Ngay
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
