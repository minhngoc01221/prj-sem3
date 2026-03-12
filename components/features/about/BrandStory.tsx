"use client";

import { Target, Award, Heart, Zap, MapPin, Users, Globe, Shield } from "lucide-react";

const milestones = [
  {
    year: "2018",
    title: "Khởi nghiệp",
    description: "Karnel Travels ra đời từ niềm đam mê du lịch và mong muốn mang vẻ đẹp Việt Nam đến với mọi du khách.",
    icon: Zap,
  },
  {
    year: "2020",
    title: "Mở rộng dịch vụ",
    description: "Bắt đầu hợp tác với các khách sạn và nhà xe uy tín, mở rộng mạng lưới đối tác.",
    icon: MapPin,
  },
  {
    year: "2022",
    title: "Đạt mốc 100K khách",
    description: "Phục vụ hơn 100.000 lượt khách hài lòng, xây dựng thương hiệu vững chắc.",
    icon: Users,
  },
  {
    year: "2024",
    title: "Mạng lưới 200+ đối tác",
    description: "Hơn 200 khách sạn, resort và đội xe trên toàn quốc đồng hành cùng Karnel Travels.",
    icon: Globe,
  },
];

const coreValues = [
  {
    icon: Shield,
    title: "Tin cậy",
    description: "Luôn đặt chất lượng dịch vụ lên hàng đầu, giữ đúng lời hứa với khách hàng.",
  },
  {
    icon: Heart,
    title: "Tận tâm",
    description: "Lắng nghe và đồng hành cùng từng khách hàng như người thân.",
  },
  {
    icon: Award,
    title: "Sáng tạo",
    description: "Không ngừng đổi mới để mang đến những trải nghiệm độc đáo và đáng nhớ.",
  },
];

export default function BrandStory() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Câu Chuyện Thương Hiệu
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hành Trình Của <span className="text-orange-500">Chúng Tôi</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Karnel Travels khởi nguồn từ niềm đam mê du lịch và mong muốn mang vẻ đẹp của Việt Nam đến với mọi du khách.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mb-20">
          {/* Timeline Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 via-orange-500 to-amber-500 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative text-center">
                {/* Dot */}
                <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg relative z-10">
                  <milestone.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Year Badge */}
                <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg px-4 py-1 rounded-full mb-3">
                  {milestone.year}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Vision */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Tầm Nhìn</h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              "Trở thành đối tác du lịch đáng tin cậy nhất của du khách trong nước, góp phần đưa Việt Nam trở thành điểm đến hàng đầu thế giới."
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Sứ Mệnh</h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              "Karnel Travels cam kết mang đến cho khách hàng những hành trình tuyệt vời nhất thông qua dịch vụ chuyên nghiệp, tận tâm và giá trị vượt mong đợi. Chúng tôi không chỉ bán tour - chúng tôi tạo ra những kỷ niệm."
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Giá Trị Cốt Lõi</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
