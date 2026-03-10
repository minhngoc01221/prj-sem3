import Image from "next/image";
import { MapPin, Star } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "Đà Nẵng",
    description: "Thành phố đáng sống với bãi biển Mỹ Khê và cầu Rồng",
    price: "2.500.000₫",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Phú Quốc",
    description: "Đảo ngọc với bãi biển trong xanh và resort cao cấp",
    price: "4.200.000₫",
    image: "https://images.unsplash.com/photo-1543489822-c49534f3271f?w=600&q=80",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Nha Trang",
    description: "Thiên đường biển đảo với nhiều hoạt động thể thao",
    price: "3.100.000₫",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Sapa",
    description: "Vùng núi Tây Bắc với ruộng bậc thang và văn hóa dân tộc",
    price: "2.800.000₫",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Hội An",
    description: "Phố cổ di sản với kiến trúc và ẩm thực đặc trưng",
    price: "2.200.000₫",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Cần Thơ",
    description: "Miền Tây với chợ nổi và vườn cây ăn trái",
    price: "1.800.000₫",
    image: "https://images.unsplash.com/photo-1569060716907-60ed066d8c81?w=600&q=80",
    rating: 4.5,
  },
];

export default function FeaturedPlaces() {
  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Điểm Đến Nổi Bật
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khám Phá <span className="text-orange-500">Miền Nam Việt Nam</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Những điểm đến đẹp nhất đang chờ đón bạn khám phá
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">{destination.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {destination.name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {destination.description}
                </p>
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-gray-500 text-sm">Giá từ</span>
                    <div className="text-orange-500 font-bold text-lg">{destination.price}</div>
                  </div>
                  <a
                    href="#book-tour"
                    className="px-4 py-2 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-colors"
                  >
                    Đặt Ngay
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 hover:shadow-xl"
          >
            Xem Tất Cả Điểm Đến
            <MapPin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
