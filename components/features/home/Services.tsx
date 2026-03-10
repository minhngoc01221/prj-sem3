import { Bus, Building2, Map, Palmtree } from "lucide-react";

const services = [
  {
    icon: Bus,
    title: "Vận Chuyển",
    description: "Dịch vụ xe du lịch chất lượng cao với đội ngũ tài xế chuyên nghiệp, an toàn và tiện nghi.",
    color: "bg-blue-500",
  },
  {
    icon: Building2,
    title: "Khách Sạn",
    description: "Đặt phòng khách sạn cao cấp với mức giá ưu đãi. Hợp tác với hàng trăm khách sạn trên toàn quốc.",
    color: "bg-purple-500",
  },
  {
    icon: Map,
    title: "Tour Du Lịch",
    description: "Các tour du lịch đa dạng từ trong nước đến quốc tế, phù hợp mọi ngân sách và sở thích.",
    color: "bg-green-500",
  },
  {
    icon: Palmtree,
    title: "Resort",
    description: "Trải nghiệm nghỉ dưỡng cao cấp tại các resort sang trọng với view đẹp và dịch vụ hoàn hảo.",
    color: "bg-teal-500",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Dịch Vụ Của Chúng Tôi
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Giải Pháp Du Lịch <span className="text-orange-500">Toàn Diện</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Chúng tôi cung cấp đầy đủ các dịch vụ du lịch để đảm bảo bạn có một chuyến đi hoàn hảo nhất.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>

              {/* Learn More Link */}
              <a
                href="#contact"
                className="inline-flex items-center gap-1 text-orange-500 font-medium mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
              >
                Tìm hiểu thêm
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
