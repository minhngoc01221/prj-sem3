import { NextRequest, NextResponse } from "next/server";
import { SpotCardData, SpotSearchResponse, Region, SpotType } from "@/types/spots";

// Mock data - In production, fetch from database
const mockSpots: SpotCardData[] = [
  {
    id: "1",
    name: "Vịnh Hạ Long",
    slug: "vinh-ha-long",
    description: "Vịnh Hạ Long - Di sản thiên nhiên thế giới với hơn 1,600 đảo đá vôi",
    location: "Quảng Ninh",
    region: Region.NORTH,
    spotType: "beach" as SpotType,
    images: ["/images/spots/halong.jpg"],
    rating: 4.7,
    reviewCount: 2845,
    bestTime: "Tháng 3 - Tháng 5, Tháng 9 - Tháng 11",
    ticketPrice: "150.000 - 450.000 VNĐ",
    tourCount: 156,
    isActive: true,
  },
  {
    id: "2",
    name: "Phong Nha - Kẻ Bàng",
    slug: "phong-nha-ke-bang",
    description: "Vườn quốc gia Phong Nha - Kẻ Bàng với hệ thống hang động kỳ vĩ",
    location: "Quảng Bình",
    region: Region.CENTRAL,
    spotType: "cave" as SpotType,
    images: ["/images/spots/phongnha.jpg"],
    rating: 4.8,
    reviewCount: 1234,
    bestTime: "Tháng 4 - Tháng 8",
    ticketPrice: "80.000 - 200.000 VNĐ",
    tourCount: 89,
    isActive: true,
  },
  {
    id: "3",
    name: "Đà Nẵng - Bãi Biển Mỹ Khê",
    slug: "da-nang-bai-bien-my-khe",
    description: "Mỹ Khê được vinh danh là một trong những bãi biển đẹp nhất hành tinh",
    location: "Đà Nẵng",
    region: Region.CENTRAL,
    spotType: "beach" as SpotType,
    images: ["/images/spots/mykhe.jpg"],
    rating: 4.6,
    reviewCount: 3456,
    bestTime: "Tháng 2 - Tháng 4",
    ticketPrice: "Miễn phí",
    tourCount: 234,
    isActive: true,
  },
  {
    id: "4",
    name: "Đỉnh Fansipan",
    slug: "dinh-fansipan",
    description: "Fansipan - nóc nhà Đông Dương với độ cao 3.147m",
    location: "Lào Cai",
    region: Region.NORTH,
    spotType: "mountain" as SpotType,
    images: ["/images/spots/fansipan.jpg"],
    rating: 4.9,
    reviewCount: 1876,
    bestTime: "Tháng 9 - Tháng 11, Tháng 3 - Tháng 5",
    ticketPrice: "300.000 - 500.000 VNĐ",
    tourCount: 178,
    isActive: true,
  },
  {
    id: "5",
    name: "Phú Quốc",
    slug: "phu-quoc",
    description: "Đảo ngọc Phú Quốc với bãi biển trong xanh và san hô đẹp",
    location: "Kiên Giang",
    region: Region.SOUTH,
    spotType: "island" as SpotType,
    images: ["/images/spots/phuquoc.jpg"],
    rating: 4.5,
    reviewCount: 4521,
    bestTime: "Tháng 10 - Tháng 3",
    ticketPrice: "Miễn phí",
    tourCount: 312,
    isActive: true,
  },
  {
    id: "6",
    name: "Thác Bờ",
    slug: "thac-bo",
    description: "Thác Bờ - thác nước cao nhất Việt Nam với độ cao 100m",
    location: "Hòa Bình",
    region: Region.NORTH,
    spotType: "waterfall" as SpotType,
    images: ["/images/spots/thacbo.jpg"],
    rating: 4.7,
    reviewCount: 987,
    bestTime: "Tháng 5 - Tháng 11",
    ticketPrice: "50.000 VNĐ",
    tourCount: 67,
    isActive: true,
  },
  {
    id: "7",
    name: "Huế - Đại Nội",
    slug: "hue-dai-noi",
    description: "Kinh thành Huế - di sản văn hóa thế giới với kiến trúc cổ độc đáo",
    location: "Thừa Thiên Huế",
    region: Region.CENTRAL,
    spotType: "historical" as SpotType,
    images: ["/images/spots/hue.jpg"],
    rating: 4.8,
    reviewCount: 2134,
    bestTime: "Tháng 3 - Tháng 5",
    ticketPrice: "100.000 - 200.000 VNĐ",
    tourCount: 145,
    isActive: true,
  },
  {
    id: "8",
    name: "Nha Trang",
    slug: "nha-trang",
    description: "Nha Trang - thiên đường biển với đảo Vinpearl nổi tiếng",
    location: "Khánh Hòa",
    region: Region.SOUTH,
    spotType: "beach" as SpotType,
    images: ["/images/spots/nhatrang.jpg"],
    rating: 4.6,
    reviewCount: 5678,
    bestTime: "Tháng 1 - Tháng 9",
    ticketPrice: "Miễn phí",
    tourCount: 289,
    isActive: true,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get("query") || "";
  const region = searchParams.get("region") as Region | null;
  const type = searchParams.get("type") as SpotType | null;
  const sortBy = searchParams.get("sortBy") || "rating";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  // Filter spots
  let filteredSpots = [...mockSpots];

  // Search query (supports Vietnamese with/without diacritics)
  if (query) {
    const normalizedQuery = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    filteredSpots = filteredSpots.filter((spot) => {
      const normalizedName = spot.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedDesc = spot.description
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedLocation = spot.location
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      
      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedDesc.includes(normalizedQuery) ||
        normalizedLocation.includes(normalizedQuery) ||
        spot.name.toLowerCase().includes(query.toLowerCase()) ||
        spot.description.toLowerCase().includes(query.toLowerCase()) ||
        spot.location.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  // Filter by region
  if (region) {
    filteredSpots = filteredSpots.filter((spot) => spot.region === region);
  }

  // Filter by type
  if (type) {
    filteredSpots = filteredSpots.filter((spot) => spot.spotType === type);
  }

  // Sort
  filteredSpots.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "reviewCount":
        return b.reviewCount - a.reviewCount;
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
        return 0; // Would use createdAt in real DB
      default:
        return 0;
    }
  });

  // Pagination
  const total = filteredSpots.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedSpots = filteredSpots.slice(startIndex, startIndex + limit);

  // Build filter counts
  const regions = [
    { value: Region.NORTH, label: "Miền Bắc", count: mockSpots.filter((s) => s.region === Region.NORTH).length },
    { value: Region.CENTRAL, label: "Miền Trung", count: mockSpots.filter((s) => s.region === Region.CENTRAL).length },
    { value: Region.SOUTH, label: "Miền Nam", count: mockSpots.filter((s) => s.region === Region.SOUTH).length },
  ];

  const spotTypes = [
    { value: SpotType.BEACH, label: "Bãi biển", count: mockSpots.filter((s) => s.spotType === SpotType.BEACH).length },
    { value: SpotType.MOUNTAIN, label: "Núi", count: mockSpots.filter((s) => s.spotType === SpotType.MOUNTAIN).length },
    { value: SpotType.HISTORICAL, label: "Di tích", count: mockSpots.filter((s) => s.spotType === SpotType.HISTORICAL).length },
    { value: SpotType.WATERFALL, label: "Thác nước", count: mockSpots.filter((s) => s.spotType === SpotType.WATERFALL).length },
    { value: SpotType.ISLAND, label: "Đảo", count: mockSpots.filter((s) => s.spotType === SpotType.ISLAND).length },
    { value: SpotType.CAVE, label: "Hang động", count: mockSpots.filter((s) => s.spotType === SpotType.CAVE).length },
  ];

  const response: SpotSearchResponse = {
    data: paginatedSpots,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    filters: {
      regions,
      spotTypes,
      priceRanges: [
        { value: "free", label: "Miễn phí", count: mockSpots.filter((s) => s.ticketPrice?.includes("Miễn")).length },
        { value: "0-200", label: "Dưới 200K", count: mockSpots.filter((s) => s.ticketPrice && !s.ticketPrice.includes("Miễn")).length },
        { value: "200-500", label: "200K - 500K", count: 0 },
        { value: "500+", label: "Trên 500K", count: 0 },
      ],
    },
  };

  return NextResponse.json(response);
}
