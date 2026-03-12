"use client";

import { Plane, Building2, Car, Hotel, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

const combos = [
  {
    icon: Plane,
    title: "Vé máy bay + Khách sạn",
    description: "Di chuyển nhanh chóng, nghỉ ngơi thoải mái",
    savings: "Tiết kiệm 25%",
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  },
  {
    icon: Car,
    title: "Xe khách + Resort",
    description: "Trải nghiệm tiết kiệm nhưng sang trọng",
    savings: "Tiết kiệm 20%",
    color: "bg-green-500",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
  },
  {
    icon: Building2,
    title: "Limousine + Homestay",
    description: "Khám phá địa phương, gần gũi văn hóa",
    savings: "Tiết kiệm 15%",
    color: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
  },
  {
    icon: Hotel,
    title: "Tour + Lưu trú",
    description: "Trọn gói, không lo gì cả",
    savings: "Tiết kiệm 30%",
    color: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
  },
];

const benefits = [
  {
    icon: CheckCircle2,
    title: "Tiết kiệm đến 30%",
    description: "So với đặt riêng lẻ",
  },
  {
    icon: ArrowRight,
    title: "Tùy chỉnh linh hoạt",
    description: "Lịch trình theo ý muốn",
  },
  {
    icon: Sparkles,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ theo suốt hành trình",
  },
  {
    icon: CheckCircle2,
    title: "Một điểm đặt",
    description: "Tiện lợi và nhanh chóng",
  },
];

export default function ComboServices() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Dịch Vụ Combo
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Du Lịch Tự Do - <span className="text-orange-500">Linh Hoạt Theo Ý Muốn</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Thiết kế hành trình theo cách của bạn với dịch vụ Combo. Kết hợp hoàn hảo giữa vận chuyển và lưu trú.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{benefit.title}</div>
                <div className="text-gray-500 text-xs">{benefit.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Combos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {combos.map((combo, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url('${combo.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* Savings Badge */}
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {combo.savings}
                </div>

                {/* Icon */}
                <div className={`absolute bottom-3 left-3 w-10 h-10 ${combo.color} rounded-lg flex items-center justify-center`}>
                  <combo.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
                  {combo.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {combo.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105"
          >
            Tư Vấn Combo Phù Hợp
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
