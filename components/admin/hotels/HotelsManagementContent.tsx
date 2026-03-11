"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Image as ImageIcon,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Bed,
  DollarSign,
  Calendar,
  MessageSquare,
  Grid,
  Loader2
} from 'lucide-react';
import type { Hotel, RoomType, RoomPricing, RoomAvailability, HotelReview } from '@/types/admin';
import { formatPrice, formatDate } from './mockData';
import { HotelFormModal } from './HotelFormModal';
import { RoomTypeManagement } from './RoomTypeManagement';
import { DatePricingCalendar } from './DatePricingCalendar';
import { RoomAvailabilityGrid } from './RoomAvailabilityGrid';
import { GalleryManager } from './GalleryManager';
import { HotelReviewsList } from './HotelReviewsList';

interface HotelsManagementContentProps {
  hotels?: Hotel[];
  isLoading?: boolean;
}

type DetailTab = 'rooms' | 'pricing' | 'availability' | 'gallery' | 'reviews';

export function HotelsManagementContent({ hotels: initialHotels, isLoading: initialLoading = false }: HotelsManagementContentProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [starFilter, setStarFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedDetailTab, setSelectedDetailTab] = useState<DetailTab>('rooms');
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);

  const itemsPerPage = 10;

  // Fetch hotels from API
  const fetchHotels = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (cityFilter !== 'all') params.set('city', cityFilter);
      if (starFilter !== 'all') params.set('starRating', starFilter);
      if (searchTerm) params.set('search', searchTerm);

      const response = await fetch(`/api/hotels?${params}`);
      if (response.ok) {
        const data = await response.json();
        // Map MongoDB response to Hotel type
        const mappedHotels: Hotel[] = data.map((hotel: any) => ({
          id: hotel._id?.toString() || hotel.id,
          name: hotel.name,
          description: hotel.description || '',
          address: hotel.address,
          city: hotel.city,
          starRating: hotel.starRating,
          priceRange: hotel.priceMin && hotel.priceMax 
            ? `${formatPrice(hotel.priceMin)} - ${formatPrice(hotel.priceMax)}`
            : '',
          amenities: hotel.amenities || [],
          images: hotel.images || [],
          rating: hotel.rating || 0,
          reviewCount: hotel.reviews?.length || 0,
          isActive: true,
          contactPhone: hotel.contact,
          roomTypes: (hotel.roomTypes || hotel.rooms || []).map((room: any) => ({
            id: room._id?.toString() || room.id,
            name: room.type,
            description: room.description || '',
            basePrice: room.basePrice || room.price,
            capacity: room.maxGuests,
            maxCapacity: room.maxGuests,
            amenities: room.amenities || [],
            images: room.images || [],
            totalRooms: room.totalRooms || 0,
            availableRooms: room.available || 0,
            pricing: (room.pricing || []).map((p: any) => ({
              id: p.id,
              date: p.date,
              price: p.price,
              isSpecial: p.isSpecial,
              specialReason: p.specialReason,
            })) || [],
            availability: (room.availability || []).map((a: any) => ({
              id: a.id,
              date: a.date,
              available: a.available,
              booked: a.booked || 0,
            })) || [],
          })) || [],
          reviews: (hotel.reviews || []).map((r: any) => ({
            id: r.id,
            hotelId: r.hotelId,
            userId: r.userId || '',
            userName: r.userName,
            userAvatar: r.userAvatar,
            rating: r.rating,
            comment: r.comment,
            images: r.images || [],
            createdAt: r.createdAt,
            response: r.response ? {
              content: r.response,
              respondedAt: r.respondedAt,
            } : undefined,
          })) || [],
          createdAt: hotel.createdAt,
          updatedAt: hotel.updatedAt,
        }));
        setHotels(mappedHotels);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cityFilter, starFilter, searchTerm]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // Fetch hotel details when selectedHotel changes
  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (selectedHotel?.id) {
        try {
          const response = await fetch(`/api/hotels/${selectedHotel.id}`);
          if (response.ok) {
            const data = await response.json();
            const mappedHotel: Hotel = {
              id: data._id?.toString() || data.id,
              name: data.name,
              description: data.description || '',
              address: data.address || '',
              city: data.city || '',
              starRating: data.starRating || 0,
              priceRange: data.priceMin && data.priceMax
                ? `${formatPrice(data.priceMin)} - ${formatPrice(data.priceMax)}`
                : '',
              amenities: data.amenities || [],
              images: data.images || [],
              rating: data.rating || 0,
              reviewCount: data.reviews?.length || 0,
              isActive: data.isActive ?? true,
              contactPhone: data.contact,
              roomTypes: (data.roomTypes || data.rooms || []).map((room: any) => ({
                id: room._id?.toString() || room.id,
                name: room.type,
                description: room.description || '',
                basePrice: room.basePrice || room.price,
                capacity: room.maxGuests,
                maxCapacity: room.maxGuests,
                amenities: room.amenities || [],
                images: room.images || [],
                totalRooms: room.totalRooms || 0,
                availableRooms: room.available || 0,
                pricing: (room.pricing || []).map((p: any) => ({
                  id: p._id?.toString() || p.id,
                  date: p.date,
                  price: p.price,
                  isSpecial: p.isSpecial,
                  specialReason: p.specialReason,
                })),
                availability: (room.availability || []).map((a: any) => ({
                  id: a._id?.toString() || a.id,
                  date: a.date,
                  available: a.available,
                  booked: a.booked || 0,
                })),
              })),
              reviews: (data.reviews || []).map((r: any) => ({
                id: r._id?.toString() || r.id,
                hotelId: r.hotelId,
                userId: r.userId || '',
                userName: r.userName,
                userAvatar: r.userAvatar,
                rating: r.rating,
                comment: r.comment,
                images: r.images || [],
                createdAt: r.createdAt,
                response: r.response ? {
                  content: r.response,
                  respondedAt: r.respondedAt,
                } : undefined,
              })) || [],
              createdAt: data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt || new Date().toISOString(),
            };
            setSelectedHotel(mappedHotel);
            if (mappedHotel.roomTypes && mappedHotel.roomTypes.length > 0) {
              setSelectedRoomType(mappedHotel.roomTypes[0]);
            } else {
              setSelectedRoomType(null);
            }
          }
        } catch (error) {
          console.error('Error fetching hotel details:', error);
        }
      }
    };

    fetchHotelDetails();
  }, [selectedHotel?.id]);

  const cities = [...new Set(hotels.map(h => h.city))];

  const filteredHotels = hotels.filter(hotel => {
    const hotelName = hotel.name?.toLowerCase() || '';
    const hotelAddress = hotel.address?.toLowerCase() || '';
    const search = searchTerm?.toLowerCase() || '';
    
    const matchesSearch = hotelName.includes(search) ||
      hotelAddress.includes(search);
    const matchesCity = cityFilter === 'all' || hotel.city === cityFilter;
    const matchesStar = starFilter === 'all' || hotel.starRating === parseInt(starFilter);
    return matchesSearch && matchesCity && matchesStar;
  });

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedHotels.length === paginatedHotels.length) {
      setSelectedHotels([]);
    } else {
      setSelectedHotels(paginatedHotels.map(hotel => hotel.id));
    }
  };

  const handleSelectHotel = (id: string) => {
    setSelectedHotels(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleActive = async (id: string) => {
    try {
      const hotel = hotels.find(h => h.id === id);
      if (!hotel) return;

      const response = await fetch(`/api/hotels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...hotel, isActive: !hotel.isActive }),
      });

      if (response.ok) {
        setHotels(prev => prev.map(h =>
          h.id === id ? { ...h, isActive: !h.isActive } : h
        ));
      }
    } catch (error) {
      console.error('Error toggling hotel status:', error);
    }
  };

  const handleAddNew = () => {
    setSelectedHotel(null);
    setFormMode('add');
    setIsFormModalOpen(true);
  };

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDelete = async (hotel: Hotel) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khách sạn "${hotel.name}"?`)) return;

    try {
      const response = await fetch(`/api/hotels/${hotel.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHotels(prev => prev.filter(h => h.id !== hotel.id));
      }
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const handleViewDetails = async (hotel: Hotel) => {
    try {
      const response = await fetch(`/api/hotels/${hotel.id}`);
      if (response.ok) {
        const data = await response.json();
        // Map the response similar to fetchHotels
        const mappedHotel: Hotel = {
          id: data._id?.toString() || data.id,
          name: data.name,
          description: data.description || '',
          address: data.address || '',
          city: data.city || '',
          starRating: data.starRating || 0,
          priceRange: data.priceMin && data.priceMax
            ? `${formatPrice(data.priceMin)} - ${formatPrice(data.priceMax)}`
            : '',
          amenities: data.amenities || [],
          images: data.images || [],
          rating: data.rating || 0,
          reviewCount: data.reviews?.length || 0,
          isActive: data.isActive ?? true,
          contactPhone: data.contact,
          roomTypes: (data.roomTypes || data.rooms || []).map((room: any) => ({
            id: room._id?.toString() || room.id,
            name: room.type,
            description: room.description || '',
            basePrice: room.basePrice || room.price,
            capacity: room.maxGuests,
            maxCapacity: room.maxGuests,
            amenities: room.amenities || [],
            images: room.images || [],
            totalRooms: room.totalRooms || 0,
            availableRooms: room.available || 0,
            pricing: (room.pricing || []).map((p: any) => ({
              id: p._id?.toString() || p.id,
              date: p.date,
              price: p.price,
              isSpecial: p.isSpecial,
              specialReason: p.specialReason,
            })),
            availability: (room.availability || []).map((a: any) => ({
              id: a._id?.toString() || a.id,
              date: a.date,
              available: a.available,
              booked: a.booked || 0,
            })),
          })),
          reviews: (data.reviews || []).map((r: any) => ({
            id: r._id?.toString() || r.id,
            hotelId: r.hotelId,
            userId: r.userId || '',
            userName: r.userName,
            userAvatar: r.userAvatar,
            rating: r.rating,
            comment: r.comment,
            images: r.images || [],
            createdAt: r.createdAt,
            response: r.response ? {
              content: r.response,
              respondedAt: r.respondedAt,
            } : undefined,
          })) || [],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
        setSelectedHotel(mappedHotel);
        setSelectedDetailTab('rooms');
        if (mappedHotel.roomTypes && mappedHotel.roomTypes.length > 0) {
          setSelectedRoomType(mappedHotel.roomTypes[0]);
        } else {
          setSelectedRoomType(null);
        }
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    }
  };

  const handleFormSubmit = async (data: Partial<Hotel>) => {
    try {
      const hotelData = {
        name: data.name,
        address: data.address,
        city: data.city,
        starRating: data.starRating,
        priceMin: data.roomTypes?.[0]?.basePrice || 0,
        priceMax: data.roomTypes?.[data.roomTypes.length - 1]?.basePrice || 0,
        amenities: data.amenities || [],
        images: data.images || [],
        description: data.description || '',
        contact: data.contactPhone || '',
        policies: '',
      };

      if (formMode === 'add') {
        const response = await fetch('/api/hotels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hotelData),
        });

        if (response.ok) {
          await fetchHotels();
          setIsFormModalOpen(false);
          setSelectedHotel(null);
        }
      } else if (selectedHotel) {
        const response = await fetch(`/api/hotels/${selectedHotel.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hotelData),
        });

        if (response.ok) {
          await fetchHotels();
          setIsFormModalOpen(false);
          setSelectedHotel(null);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleUpdateRoomTypes = async (roomTypes: RoomType[]) => {
    if (!selectedHotel) return;

    try {
      const originalRoomTypes = selectedHotel.roomTypes || [];

      // Find deleted room types (exist in original but not in new list)
      const deletedRoomTypes = originalRoomTypes.filter(
        orig => !roomTypes.find(rt => rt.id === orig.id || rt.id.startsWith('rt-'))
      );

      // Delete removed room types from database
      for (const deletedRoom of deletedRoomTypes) {
        if (!deletedRoom.id.startsWith('rt-')) {
          await fetch(`/api/rooms/${deletedRoom.id}`, {
            method: 'DELETE',
          });
        }
      }

      // For each room type, create/update in database
      for (const roomType of roomTypes) {
        const roomData = {
          type: roomType.name,
          description: roomType.description,
          price: roomType.basePrice,
          basePrice: roomType.basePrice,
          available: roomType.availableRooms,
          totalRooms: roomType.totalRooms,
          maxGuests: roomType.maxCapacity,
          amenities: roomType.amenities,
          images: roomType.images,
        };

        if (roomType.id.startsWith('rt-')) {
          // New room type - create via API
          const response = await fetch(`/api/hotels/${selectedHotel.id}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomData),
          });

          if (response.ok) {
            const newRoom = await response.json();
            // Update the roomType id with the new id
            roomType.id = newRoom._id?.toString() || newRoom.id;
          }
        } else {
          // Existing room - update via PUT
          const response = await fetch(`/api/rooms/${roomType.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomData),
          });

          if (!response.ok) {
            console.error('Failed to update room:', roomType.id);
          }
        }
      }

      // Fetch updated hotel data
      const response = await fetch(`/api/hotels/${selectedHotel.id}`);
      if (response.ok) {
        const data = await response.json();
        const mappedHotel: Hotel = {
          id: data._id?.toString() || data.id,
          name: data.name,
          description: data.description || '',
          address: data.address,
          city: data.city,
          starRating: data.starRating,
          priceRange: data.priceMin && data.priceMax
            ? `${formatPrice(data.priceMin)} - ${formatPrice(data.priceMax)}`
            : '',
          amenities: data.amenities || [],
          images: data.images || [],
          rating: data.rating || 0,
          reviewCount: data.reviews?.length || 0,
          isActive: data.isActive ?? true,
          contactPhone: data.contact,
          roomTypes: data.roomTypes?.map((room: any) => ({
            id: room._id?.toString() || room.id,
            name: room.type,
            description: room.description || '',
            basePrice: room.basePrice || room.price,
            capacity: room.maxGuests,
            maxCapacity: room.maxGuests,
            amenities: room.amenities || [],
            images: room.images || [],
            totalRooms: room.totalRooms || 0,
            availableRooms: room.available || 0,
            pricing: (room.pricing || []).map((p: any) => ({
              id: p._id?.toString() || p.id,
              date: p.date,
              price: p.price,
              isSpecial: p.isSpecial,
              specialReason: p.specialReason,
            })) || [],
            availability: (room.availability || []).map((a: any) => ({
              id: a._id?.toString() || a.id,
              date: a.date,
              available: a.available,
              booked: a.booked,
            })) || [],
          })) || [],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
        setSelectedHotel(mappedHotel);
        setHotels(prev => prev.map(h =>
          h.id === selectedHotel.id ? mappedHotel : h
        ));
      }
    } catch (error) {
      console.error('Error updating room types:', error);
    }
  };

  const handleUpdatePricing = async (roomTypeId: string, pricing: RoomPricing[]) => {
    if (!selectedHotel) return;

    try {
      if (!roomTypeId.startsWith('rt-')) {
        await fetch(`/api/rooms/${roomTypeId}/pricing`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pricing }),
        });
      }

      const updatedRoomTypes = selectedHotel.roomTypes?.map(rt =>
        rt.id === roomTypeId ? { ...rt, pricing } : rt
      ) || [];

      setSelectedHotel(prev => prev ? { ...prev, roomTypes: updatedRoomTypes } : null);
      setHotels(prev => prev.map(h =>
        h.id === selectedHotel.id ? { ...h, roomTypes: updatedRoomTypes } : h
      ));
    } catch (error) {
      console.error('Error updating pricing:', error);
    }
  };

  const handleUpdateAvailability = async (roomTypeId: string, availability: RoomAvailability[]) => {
    if (!selectedHotel) return;

    try {
      if (!roomTypeId.startsWith('rt-')) {
        await fetch(`/api/rooms/${roomTypeId}/availability`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ availability }),
        });
      }

      const updatedRoomTypes = selectedHotel.roomTypes?.map(rt =>
        rt.id === roomTypeId ? { ...rt, availability } : rt
      ) || [];

      setSelectedHotel(prev => prev ? { ...prev, roomTypes: updatedRoomTypes } : null);
      setHotels(prev => prev.map(h =>
        h.id === selectedHotel.id ? { ...h, roomTypes: updatedRoomTypes } : h
      ));
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleUpdateGallery = async (images: string[]) => {
    if (!selectedHotel) return;

    try {
      await fetch(`/api/hotels/${selectedHotel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });

      setSelectedHotel(prev => prev ? { ...prev, images } : null);
      setHotels(prev => prev.map(h =>
        h.id === selectedHotel.id ? { ...h, images } : h
      ));
    } catch (error) {
      console.error('Error updating gallery:', error);
    }
  };

  const handleReplyReview = async (reviewId: string, response: string) => {
    // For now, just update local state
    if (!selectedHotel) return;

    const updatedReviews = selectedHotel.reviews?.map(review =>
      review.id === reviewId
        ? { ...review, response: { content: response, respondedAt: new Date().toISOString() } }
        : review
    ) || [];

    setSelectedHotel(prev => prev ? { ...prev, reviews: updatedReviews } : null);
    setHotels(prev => prev.map(h =>
      h.id === selectedHotel.id ? { ...h, reviews: updatedReviews } : h
    ));
  };

  const handleBackToList = () => {
    setSelectedHotel(null);
    setSelectedRoomType(null);
    fetchHotels();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Hotel Detail View
  if (selectedHotel) {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{selectedHotel.name}</h1>
            <p className="text-gray-500 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {selectedHotel.starRating} sao • {selectedHotel.city} • {selectedHotel.address}
            </p>
          </div>
          <button
            onClick={() => handleEdit(selectedHotel)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Chỉnh sửa
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setSelectedDetailTab('rooms')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedDetailTab === 'rooms'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bed className="w-4 h-4" />
              Loại phòng ({selectedHotel.roomTypes?.length || 0})
            </button>
            <button
              onClick={() => setSelectedDetailTab('pricing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedDetailTab === 'pricing'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Quản lý giá
            </button>
            <button
              onClick={() => setSelectedDetailTab('availability')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedDetailTab === 'availability'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Tình trạng phòng
            </button>
            <button
              onClick={() => setSelectedDetailTab('gallery')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedDetailTab === 'gallery'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
              Gallery
            </button>
            <button
              onClick={() => setSelectedDetailTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedDetailTab === 'reviews'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Đánh giá ({selectedHotel.reviews?.length || 0})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {selectedDetailTab === 'rooms' && (
            <RoomTypeManagement
              roomTypes={selectedHotel.roomTypes || []}
              onUpdate={handleUpdateRoomTypes}
            />
          )}

          {selectedDetailTab === 'pricing' && (
            <div className="space-y-6">
              {selectedHotel.roomTypes && selectedHotel.roomTypes.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Chọn loại phòng:</span>
                  <div className="flex gap-2">
                    {selectedHotel.roomTypes.map(rt => (
                      <button
                        key={rt.id}
                        onClick={() => setSelectedRoomType(rt)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedRoomType?.id === rt.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {rt.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selectedRoomType ? (
                <DatePricingCalendar
                  roomType={selectedRoomType}
                  onUpdatePricing={(pricing) => handleUpdatePricing(selectedRoomType.id, pricing)}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Vui lòng chọn loại phòng để quản lý giá
                </div>
              )}
            </div>
          )}

          {selectedDetailTab === 'availability' && (
            <div className="space-y-6">
              {selectedHotel.roomTypes && selectedHotel.roomTypes.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Chọn loại phòng:</span>
                  <div className="flex gap-2">
                    {selectedHotel.roomTypes.map(rt => (
                      <button
                        key={rt.id}
                        onClick={() => setSelectedRoomType(rt)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedRoomType?.id === rt.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {rt.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selectedRoomType ? (
                <RoomAvailabilityGrid
                  roomType={selectedRoomType}
                  onUpdateAvailability={(availability) => handleUpdateAvailability(selectedRoomType.id, availability)}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Vui lòng chọn loại phòng để xem tình trạng
                </div>
              )}
            </div>
          )}

          {selectedDetailTab === 'gallery' && (
            <GalleryManager
              images={selectedHotel.images || []}
              onUpdate={handleUpdateGallery}
              title="Gallery khách sạn"
            />
          )}

          {selectedDetailTab === 'reviews' && (
            <HotelReviewsList
              reviews={selectedHotel.reviews || []}
              onReply={handleReplyReview}
            />
          )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách sạn</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả khách sạn trong hệ thống</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm khách sạn
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng khách sạn</p>
              <p className="text-2xl font-bold text-gray-900">{hotels.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {hotels.filter(h => h.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Khách sạn 5 sao</p>
              <p className="text-2xl font-bold text-gray-900">
                {hotels.filter(h => h.starRating === 5).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tỉnh/Thành phố</p>
              <p className="text-2xl font-bold text-gray-900">{cities.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khách sạn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tất cả thành phố</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tất cả hạng sao</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedHotels.length === paginatedHotels.length && paginatedHotels.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Hình ảnh</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Tên khách sạn</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Số loại phòng</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Đánh giá</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedHotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedHotels.includes(hotel.id)}
                      onChange={() => handleSelectHotel(hotel.id)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {hotel.images && hotel.images.length > 0 ? (
                        <img
                          src={hotel.images[0]}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{hotel.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(hotel.starRating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{hotel.city}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bed className="w-4 h-4" />
                      <span>{hotel.roomTypes?.length || 0} loại phòng</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(hotel.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        hotel.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {hotel.isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          Tắt
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{hotel.rating.toFixed(1)}</span>
                      <span className="text-gray-400 text-sm">({hotel.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetails(hotel)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(hotel)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(hotel)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredHotels.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredHotels.length)} của {filteredHotels.length} khách sạn
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredHotels.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Chưa có khách sạn nào</p>
          <button
            onClick={handleAddNew}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Thêm khách sạn đầu tiên
          </button>
        </div>
      )}

      {/* Modals */}
      <HotelFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        hotel={selectedHotel}
        mode={formMode}
      />
    </div>
  );
}
