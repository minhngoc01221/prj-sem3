import { NextRequest, NextResponse } from "next/server";
import { SpotDetailData, Region, SpotType } from "@/types/spots";

// Mock detailed spot data
const mockSpotDetails: Record<string, SpotDetailData> = {
  "1": {
    id: "1",
    name: "Vịnh Hạ Long",
    slug: "vinh-ha-long",
    description: "Vịnh Hạ Long - Di sản thiên nhiên thế giới với hơn 1,600 đảo đá vôi",
    fullDescription: "Vịnh Hạ Long nằm ở tỉnh Quảng Ninh, cách Hà Nội khoảng 170km về phía Đông Bắc. Đây là một trong những kỳ quan thiên nhiên nổi tiếng nhất của Việt Nam và đã được UNESCO công nhận là Di sản Thiên nhiên Thế giới. Vịnh có hơn 1,600 đảo và đá vôi với đủ hình dạng và kích cỡ khác nhau, tạo nên một khung cảnh tuyệt đẹp. Du khách có thể tham quan vịnh bằng thuyền, kayak, hoặc thuyền buồm.",
    location: "Quảng Ninh",
    region: Region.NORTH,
    spotType: "beach" as SpotType,
    images: [
      "/images/spots/halong-1.jpg",
      "/images/spots/halong-2.jpg",
      "/images/spots/halong-3.jpg",
      "/images/spots/halong-4.jpg",
    ],
    rating: 4.7,
    reviewCount: 2845,
    bestTime: "Tháng 3 - Tháng 5, Tháng 9 - Tháng 11",
    ticketPrice: "150.000 - 450.000 VNĐ",
    tourCount: 156,
    isActive: true,
    activities: [
      "Tham quan hang động",
      "Kayak",
      "Ngắm hoàng hôn",
      "Ăn hải sản tươi sống",
      "Cắm trại trên đảo",
    ],
    reviews: [
      {
        id: "r1",
        userName: "Nguyễn Văn A",
        rating: 5,
        comment: "Kinh nghiệm tuyệt vời! Cảnh quan vịnh Hạ Long quá đẹp, không khí trong lành, dịch vụ tốt. Tôi đặc biệt ấn tượng với hang Sửng Sốt và đảo Ti Tốp.",
        createdAt: "2024-12-15T10:00:00Z",
      },
      {
        id: "r2",
        userName: "Trần Thị B",
        rating: 4,
        comment: "Rất đẹp và ấn tượng. Nên đi vào mùa thu hoặc mùa xuân để tránh mưa bão. Thuyền và khách sạn chất lượng tốt.",
        createdAt: "2024-11-20T08:30:00Z",
      },
    ],
    nearbyHotels: [],
    nearbyRestaurants: [],
  },
  "2": {
    id: "2",
    name: "Phong Nha - Kẻ Bàng",
    slug: "phong-nha-ke-bang",
    description: "Vườn quốc gia Phong Nha - Kẻ Bàng với hệ thống hang động kỳ vĩ",
    fullDescription: "Vườn Quốc gia Phong Nha - Kẻ Bàng nằm ở tỉnh Quảng Bình, được UNESCO công nhận là Di sản Thiên nhiên Thế giới với hệ thống hang động đá vôi dài nhất Đông Nam Á. Khu vực này có hơn 300 hang động với chiều dài tổng cộng hơn 100km, bao gồm Hang Sơn Đoòng - hang động tự nhiên lớn nhất thế giới.",
    location: "Quảng Bình",
    region: Region.CENTRAL,
    spotType: "cave" as SpotType,
    images: [
      "/images/spots/phongnha-1.jpg",
      "/images/spots/phongnha-2.jpg",
    ],
    rating: 4.8,
    reviewCount: 1234,
    bestTime: "Tháng 4 - Tháng 8",
    ticketPrice: "80.000 - 200.000 VNĐ",
    tourCount: 89,
    isActive: true,
    activities: [
      "Khám phá hang động",
      "Tour sinh thái",
      "Thám hiểm",
      "Ngắm cảnh thiên nhiên",
    ],
    reviews: [
      {
        id: "r3",
        userName: "Lê Văn C",
        rating: 5,
        comment: "Trải nghiệm không thể quên! Hang động rất ấn tượng với những khối thạch nhũ đẹp mắt. Hướng dẫn viên nhiệt tình và chuyên nghiệp.",
        createdAt: "2024-10-05T14:20:00Z",
      },
    ],
    nearbyHotels: [],
    nearbyRestaurants: [],
  },
  "3": {
    id: "3",
    name: "Đà Nẵng - Bãi Biển Mỹ Khê",
    slug: "da-nang-bai-bien-my-khe",
    description: "Mỹ Khê được vinh danh là một trong những bãi biển đẹp nhất hành tinh",
    fullDescription: "Bãi biển Mỹ Khê nằm ở thành phố Đà Nẵng, từng được Tạp chí Forbes bình chọn là một trong những bãi biển đẹp nhất hành tinh. Với bờ cát trắng mịn màng, nước biển trong xanh và không khí trong lành, Mỹ Khê là điểm đến lý tưởng cho du khách muốn tận hưởng kỳ nghỉ biển hoàn hảo.",
    location: "Đà Nẵng",
    region: Region.CENTRAL,
    spotType: "beach" as SpotType,
    images: [
      "/images/spots/mykhe-1.jpg",
      "/images/spots/mykhe-2.jpg",
    ],
    rating: 4.6,
    reviewCount: 3456,
    bestTime: "Tháng 2 - Tháng 4",
    ticketPrice: "Miễn phí",
    tourCount: 234,
    isActive: true,
    activities: [
      "Tắm biển",
      "Lướt sóng",
      "Chơi jet ski",
      "Ngắm hoàng hôn",
      "Thưởng thức hải sản",
    ],
    reviews: [],
    nearbyHotels: [],
    nearbyRestaurants: [],
  },
  "4": {
    id: "4",
    name: "Đỉnh Fansipan",
    slug: "dinh-fansipan",
    description: "Fansipan - nóc nhà Đông Dương với độ cao 3.147m",
    fullDescription: "Fansipan là ngọn núi cao nhất Việt Nam và Đông Dương với độ cao 3.147m. Nằm ở huyện Sa Pa, tỉnh Lào Cai, Fansipan mời gọi những ai đam mê leo núi và muốn chinh phục đỉnh cao. Du khách có thể lên đỉnh bằng cáp treo hoặc leo bộ, trải nghiệm cảm giác đứng trên đỉnh cao nhất Đông Dương.",
    location: "Lào Cai",
    region: Region.NORTH,
    spotType: "mountain" as SpotType,
    images: [
      "/images/spots/fansipan-1.jpg",
      "/images/spots/fansipan-2.jpg",
    ],
    rating: 4.9,
    reviewCount: 1876,
    bestTime: "Tháng 9 - Tháng 11, Tháng 3 - Tháng 5",
    ticketPrice: "300.000 - 500.000 VNĐ",
    tourCount: 178,
    isActive: true,
    activities: [
      "Leo núi",
      "Chinh phục đỉnh cao",
      "Ngắm biển mây",
      "Chụp ảnh cảnh đẹp",
    ],
    reviews: [],
    nearbyHotels: [],
    nearbyRestaurants: [],
  },
  "5": {
    id: "5",
    name: "Phú Quốc",
    slug: "phu-quoc",
    description: "Đảo ngọc Phú Quốc với bãi biển trong xanh và san hô đẹp",
    fullDescription: "Phú Quốc là hòn đảo lớn nhất Việt Nam, nằm trong vịnh Thái Lan thuộc tỉnh Kiên Giang. Đảo nổi tiếng với những bãi biển hoang sơ, nước biển trong xanh, hệ sinh thái san hô phong phú và nhiều điểm tham quan hấp dẫn như Safari Phú Quốc, Vinpearl Land, làng chài Rạch Giá.",
    location: "Kiên Giang",
    region: Region.SOUTH,
    spotType: "island" as SpotType,
    images: [
      "/images/spots/phuquoc-1.jpg",
      "/images/spots/phuquoc-2.jpg",
    ],
    rating: 4.5,
    reviewCount: 4521,
    bestTime: "Tháng 10 - Tháng 3",
    ticketPrice: "Miễn phí",
    tourCount: 312,
    isActive: true,
    activities: [
      "Tắm biển",
      "Lặn ngắm san hô",
      "Tham quan Safari",
      "Ăn hải sản",
      "Mua sắm",
    ],
    reviews: [],
    nearbyHotels: [],
    nearbyRestaurants: [],
  },
  "6": {
    id: "6",
    name: "Thác Bờ",
    slug: "thac-bo",
    description: "Thác Bờ - thác nước cao nhất Việt Nam với độ cao 100m",
    fullDescription: "Thác Bờ nằm ở huyện Ba Bể, tỉnh Hòa Bình, là thác nước cao nhất Việt Nam với độ cao 100m. Thác nằm giữa rừng già với cảnh quan thiên nhiên hoang sơ, hùng vĩ. Du khách có thể trekking đến thác, tắm dưới thác nước mát lạnh và ngắm nhìn cảnh đẹp nơi đây.",
    location: "Hòa Bình",
    region: Region.NORTH,
    spotType: "waterfall" as SpotType,
    images: [
      "/images/spots/thacbo-1.jpg",
    ],
    rating: 4.7,
    reviewCount: 987,
    bestTime: "Tháng 5 - Tháng 11",
    ticketPrice: "50.000 VNĐ",
    tourCount: 67,
    isActive: true,
    activities: [
      "Ngắm thác nước",
      "Tắm thác",
      "Trekking",
      "Picnic",
    ],
    reviews: [],
    nearbyHotels: [],
    nearbyRestaurants: [],
  },
  "7": {
    id: "7",
    name: "Huế - Đại Nội",
    slug: "hue-dai-noi",
    description: "Kinh thành Huế - di sản văn hóa thế giới với kiến trúc cổ độc đáo",
    fullDescription: "Kinh thành Huế là di sản văn hóa thế giới được UNESCO công nhận, từng là kinh đô của triều Nguyễn. Khu di tích bao gồm Đại Nội (Hoàng thành), Tử Cấm thành, và Khiêm Lăng với kiến trúc độc đáo, mang đậm phong cách phương Đông kết hợp với ảnh hưởng Pháp.",
    location: "Thừa Thiên Huế",
    region: Region.CENTRAL,
    spotType: "historical" as SpotType,
    images: [
      "/images/spots/hue-1.jpg",
    ],
    rating: 4.8,
    reviewCount: 2134,
    bestTime: "Tháng 3 - Tháng 5",
    ticketPrice: "100.000 - 200.000 VNĐ",
    tourCount: 145,
    isActive: true,
    activities: [
      "Tham quan di tích",
      "Chụp ảnh cưới",
      "Tìm hiểu lịch sử",
      "Thưởng thức ẩm thực cung đình",
    ],
    reviews: [],
    nearbyHotels: [],
    nearbyRestaurants: [],
  },
  "8": {
    id: "8",
    name: "Nha Trang",
    slug: "nha-trang",
    description: "Nha Trang - thiên đường biển với đảo Vinpearl nổi tiếng",
    fullDescription: "Nha Trang là thành phố biển nổi tiếng nhất miền Trung Việt Nam, thuộc tỉnh Khánh Hòa. Thành phố có bờ biển dài 6km với cát trắng, nước biển trong xanh. Nha Trang còn nổi tiếng với đảo Vinpearl - khu du lịch với cáp treo vượt biển, công viên nước, và thủy cung.",
    location: "Khánh Hòa",
    region: Region.SOUTH,
    spotType: "beach" as SpotType,
    images: [
      "/images/spots/nhatrang-1.jpg",
    ],
    rating: 4.6,
    reviewCount: 5678,
    bestTime: "Tháng 1 - Tháng 9",
    ticketPrice: "Miễn phí",
    tourCount: 289,
    isActive: true,
    activities: [
      "Tắm biển",
      "Tham quan Vinpearl",
      "Cáp treo vượt biển",
      "Lặn ngắm san hô",
      "Spa & Wellness",
    ],
    reviews: [],
    nearbyHotels: [],
    nearbyRestaurants: [],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Try to find by id first, then by slug
  const spot = mockSpotDetails[id];
  
  if (!spot) {
    // Try to find by slug
    const foundSpot = Object.values(mockSpotDetails).find(s => s.slug === id);
    if (foundSpot) {
      return NextResponse.json({ data: foundSpot });
    }
    
    return NextResponse.json(
      { error: "Spot not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: spot });
}
