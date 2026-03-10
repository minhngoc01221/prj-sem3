import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Hơn 15 năm kinh nghiệm trong ngành du lịch",
  "Đội ngũ hướng dẫn viên chuyên nghiệp, tận tâm",
  "Cam kết chất lượng dịch vụ hàng đầu",
  "Giá tour cạnh tranh nhất thị trường",
];

export default function Introduction() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="relative">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80"
                alt="Du lịch Việt Nam"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative Card */}
            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-xl shadow-xl max-w-[200px]">
              <div className="text-4xl font-bold">15+</div>
              <div className="text-sm opacity-90">Năm Kinh Nghiệm</div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-100 rounded-full -z-10" />
            <div className="absolute top-1/2 -left-8 w-16 h-16 border-4 border-orange-200 rounded-full -z-10" />
          </div>

          {/* Content Column */}
          <div>
            <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Về Chúng Tôi
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Khám Phá Việt Nam Cùng
              <span className="text-orange-500"> Du Lịch Việt</span>
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Chúng tôi tự hào là một trong những công ty du lịch hàng đầu Việt Nam, 
              chuyên cung cấp các tour du lịch chất lượng cao với mức giá hợp lý. 
              Với đội ngũ chuyên nghiệp và tâm huyết, chúng tôi cam kết mang đến 
              cho quý khách những trải nghiệm du lịch đáng nhớ nhất.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Từ những danh lam thắng cảnh nổi tiếng đến những góc khuất ít người biết, 
              chúng tôi sẽ đồng hành cùng bạn trên mọi chặng đường khám phá 
              vẻ đẹp muôn màu của Việt Nam.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
            >
              Tìm Hiểu Thêm
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
