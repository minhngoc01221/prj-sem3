import type { Hotel, HotelReview, RoomType, RoomPricing, RoomAvailability } from '@/types/admin';

const generateDateRange = (startDate: string, days: number): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const generateRoomPricing = (basePrice: number, dates: string[]): RoomPricing[] => {
  return dates.map((date, index) => {
    const dayOfWeek = new Date(date).getDay();
    let price = basePrice;
    let isSpecial = false;
    let specialReason = '';

    // Weekend pricing (Friday, Saturday)
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      price = Math.round(basePrice * 1.2);
    }

    // Special dates
    if (date === '2026-04-30' || date === '2026-05-01') {
      price = Math.round(basePrice * 1.5);
      isSpecial = true;
      specialReason = 'Ngày lễ';
    } else if (date === '2026-06-01') {
      price = Math.round(basePrice * 1.3);
      isSpecial = true;
      specialReason = 'Quốc tế thiếu nhi';
    } else if (date === '2026-09-02') {
      price = Math.round(basePrice * 1.5);
      isSpecial = true;
      specialReason = 'Ngày Quốc khánh';
    }

    return {
      id: `price-${index}`,
      date,
      price,
      isSpecial,
      specialReason: isSpecial ? specialReason : undefined,
    };
  });
};

const generateRoomAvailability = (totalRooms: number, dates: string[]): RoomAvailability[] => {
  return dates.map((date, index) => {
    // Simulate random booking pattern
    const booked = Math.floor(Math.random() * (totalRooms - 1));
    return {
      id: `avail-${index}`,
      date,
      available: totalRooms - booked,
      booked,
    };
  });
};

const today = new Date().toISOString().split('T')[0];
const next30Days = generateDateRange(today, 30);

export const mockHotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Grand Palace Hotel & Spa',
    description: 'Khách sạn sang trọng 5 sao tọa lạc tại trung tâm thành phố với tầm nhìn panorama tuyệt đẹp. Featuring world-class amenities including a full-service spa, infinity pool, and multiple fine-dining restaurants.',
    address: '08 Lê Lợi, Quận 1',
    city: 'TP. Hồ Chí Minh',
    starRating: 5,
    priceRange: '2.500.000 - 8.000.000 VNĐ',
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking', 'Airport Shuttle', 'Business Center'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
    rating: 4.8,
    reviewCount: 1256,
    isActive: true,
    contactPhone: '+84 28 3822 8888',
    contactEmail: 'reservations@grandpalace.com',
    roomTypes: [
      {
        id: 'rt-1-1',
        name: 'Deluxe King Room',
        description: 'Phòng Deluxe sang trọng với giường King size, view thành phố',
        basePrice: 2500000,
        capacity: 2,
        maxCapacity: 3,
        amenities: ['WiFi', 'TV', 'Minibar', 'Safe', 'Air Conditioning', 'Balcony'],
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        ],
        totalRooms: 15,
        availableRooms: 8,
        pricing: generateRoomPricing(2500000, next30Days),
        availability: generateRoomAvailability(15, next30Days),
      },
      {
        id: 'rt-1-2',
        name: 'Executive Suite',
        description: 'Suite cao cấp với phòng khách riêng biệt và butler service',
        basePrice: 5000000,
        capacity: 2,
        maxCapacity: 4,
        amenities: ['WiFi', 'TV', 'Minibar', 'Safe', 'Air Conditioning', 'Balcony', 'Jacuzzi', 'Butler Service'],
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
        ],
        totalRooms: 8,
        availableRooms: 3,
        pricing: generateRoomPricing(5000000, next30Days),
        availability: generateRoomAvailability(8, next30Days),
      },
      {
        id: 'rt-1-3',
        name: 'Presidential Suite',
        description: 'Suite Tổng thống với 2 phòng ngủ, phòng khách và dining room',
        basePrice: 8000000,
        capacity: 4,
        maxCapacity: 6,
        amenities: ['WiFi', 'TV', 'Minibar', 'Safe', 'Air Conditioning', 'Balcony', 'Jacuzzi', 'Butler Service', 'Private Pool', 'Piano'],
        images: [
          'https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800',
        ],
        totalRooms: 2,
        availableRooms: 1,
        pricing: generateRoomPricing(8000000, next30Days),
        availability: generateRoomAvailability(2, next30Days),
      },
    ],
    reviews: [
      {
        id: 'rev-1-1',
        hotelId: 'hotel-1',
        userId: 'user-1',
        userName: 'Nguyễn Văn A',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        comment: 'Khách sạn tuyệt vời! Dịch vụ xuất sắc, nhân viên rất thân thiện. Đặc biệt ấn tượng với bữa sáng buffet đa dạng.',
        createdAt: '2026-02-15T10:00:00Z',
      },
      {
        id: 'rev-1-2',
        hotelId: 'hotel-1',
        userId: 'user-2',
        userName: 'Trần Thị B',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        rating: 4,
        comment: 'Vị trí thuận tiện, phòng sạch sẽ. Tuy nhiên check-in hơi lâu.',
        createdAt: '2026-02-10T08:30:00Z',
      },
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'hotel-2',
    name: 'Ocean View Resort Da Nang',
    description: 'Khu nghỉ dưỡng biển 5 sao với bãi biển riêng, view biển Đông tuyệt đẹp. Perfect for family vacations and romantic getaways with pristine beaches and world-class facilities.',
    address: '25 Vo Nguyen Giap, Bai Bac',
    city: 'Đà Nẵng',
    starRating: 5,
    priceRange: '3.000.000 - 10.000.000 VNĐ',
    amenities: ['WiFi', 'Private Beach', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Kids Club', 'Water Sports', 'Tennis Court'],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    ],
    rating: 4.9,
    reviewCount: 2341,
    isActive: true,
    contactPhone: '+84 236 395 8888',
    contactEmail: 'booking@oceanviewresort.com',
    roomTypes: [
      {
        id: 'rt-2-1',
        name: 'Garden Villa',
        description: 'Biệt thự với view vườn nhiệt đới, có hồ bơi riêng',
        basePrice: 4000000,
        capacity: 2,
        maxCapacity: 4,
        amenities: ['WiFi', 'TV', 'Minibar', 'Safe', 'Air Conditioning', 'Private Pool', 'Garden View'],
        images: [
          'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800',
        ],
        totalRooms: 10,
        availableRooms: 5,
        pricing: generateRoomPricing(4000000, next30Days),
        availability: generateRoomAvailability(10, next30Days),
      },
      {
        id: 'rt-2-2',
        name: 'Ocean Deluxe Room',
        description: 'Phòng Deluxe với ban công view biển trực tiếp',
        basePrice: 3500000,
        capacity: 2,
        maxCapacity: 3,
        amenities: ['WiFi', 'TV', 'Minibar', 'Safe', 'Air Conditioning', 'Balcony', 'Ocean View'],
        images: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        ],
        totalRooms: 20,
        availableRooms: 12,
        pricing: generateRoomPricing(3500000, next30Days),
        availability: generateRoomAvailability(20, next30Days),
      },
      {
        id: 'rt-2-3',
        name: 'Beachfront Bungalow',
        description: 'Bungalow biển độc lập, cách bãi biển vài bước chân',
        basePrice: 6000000,
        capacity: 2,
        maxCapacity: 3,
        amenities: ['WiFi', 'TV', 'Minibar', 'Safe', 'Air Conditioning', 'Private Terrace', 'Beach Access'],
        images: [
          'https://images.unsplash.com/photo-1609112886084-3d378d0c045e?w=800',
        ],
        totalRooms: 6,
        availableRooms: 2,
        pricing: generateRoomPricing(6000000, next30Days),
        availability: generateRoomAvailability(6, next30Days),
      },
    ],
    reviews: [
      {
        id: 'rev-2-1',
        hotelId: 'hotel-2',
        userId: 'user-3',
        userName: 'Lê Hoàng C',
        userAvatar: 'https://i.pravatar.cc/150?img=3',
        rating: 5,
        comment: 'Kỳ nghỉ tuyệt vời! Bãi biển đẹp, nước trong xanh. Kids club rất tuyệt vời cho gia đình có con nhỏ.',
        images: [
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400',
        ],
        createdAt: '2026-03-01T14:20:00Z',
      },
    ],
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'hotel-3',
    name: 'Ha Long Bay Hotel',
    description: 'Khách sạn 4 sao tại vịnh Hạ Long với tầm view vịnh tuyệt đẹp. Nơi lý tưởng để khám phá vịnh Hạ Long và trải nghiệm văn hóa địa phương.',
    address: '88 Hung Thang, Ha Long',
    city: 'Quảng Ninh',
    starRating: 4,
    priceRange: '1.500.000 - 4.500.000 VNĐ',
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Tour Desk', 'Car Rental', 'Laundry'],
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    ],
    rating: 4.5,
    reviewCount: 876,
    isActive: true,
    contactPhone: '+84 203 384 8888',
    contactEmail: 'info@halongbayhotel.com',
    roomTypes: [
      {
        id: 'rt-3-1',
        name: 'Standard City View',
        description: 'Phòng Standard với view thành phố, giường đôi',
        basePrice: 1500000,
        capacity: 2,
        maxCapacity: 2,
        amenities: ['WiFi', 'TV', 'Minibar', 'Air Conditioning'],
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
        ],
        totalRooms: 25,
        availableRooms: 18,
        pricing: generateRoomPricing(1500000, next30Days),
        availability: generateRoomAvailability(25, next30Days),
      },
      {
        id: 'rt-3-2',
        name: 'Superior Bay View',
        description: 'Phòng Superior với view vịnh Hạ Long ngoài cửa sổ',
        basePrice: 2200000,
        capacity: 2,
        maxCapacity: 3,
        amenities: ['WiFi', 'TV', 'Minibar', 'Air Conditioning', 'Bay View', 'Balcony'],
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        ],
        totalRooms: 15,
        availableRooms: 7,
        pricing: generateRoomPricing(2200000, next30Days),
        availability: generateRoomAvailability(15, next30Days),
      },
    ],
    reviews: [
      {
        id: 'rev-3-1',
        hotelId: 'hotel-3',
        userId: 'user-4',
        userName: 'Phạm Thị D',
        userAvatar: 'https://i.pravatar.cc/150?img=9',
        rating: 4,
        comment: 'View vịnh Hạ Long rất đẹp, nhân viên nhiệt tình. Khách sạn sạch sẽ, tiện nghi tốt.',
        createdAt: '2026-01-20T09:15:00Z',
        response: {
          content: 'Cảm ơn quý khách! Chúng tôi rất vui khi quý khách hài lòng với dịch vụ của chúng tôi.',
          respondedAt: '2026-01-20T15:30:00Z',
        },
      },
    ],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
