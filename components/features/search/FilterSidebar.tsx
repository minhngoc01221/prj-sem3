// Search Filters Sidebar
// F034-F035: Filter components

"use client";

import { SearchType, Region, SpotType, SortOption, CuisineType, PriceRange, RestaurantStyle, ResortLocationType, ResortType } from '@/types/search';
import { useState, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  currentType: SearchType;
}

interface FilterState {
  // Spot filters
  region?: Region;
  spotType?: SpotType;
  minRating?: number;
  maxTicketPrice?: number;
  
  // Hotel filters
  city?: string;
  starRating: number[];
  priceRange: { min?: number; max?: number };
  amenities: string[];
  
  // Restaurant filters
  cuisineType: CuisineType[];
  priceRangeRestaurant: PriceRange[];
  style: RestaurantStyle[];
  
  // Resort filters
  locationType: ResortLocationType[];
  resortType: ResortType[];
  
  // Tour filters (F051-F055)
  destination?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  
  // Transport filters (F056-F060)
  transportType?: string[];
  departure?: string;
  arrival?: string;
  company?: string[];
  
  // Sorting
  sort: SortOption;
}

const AMENITIES = [
  'wifi', 'bể bơi', 'nhà hàng', 'spa', 'gym', 'điều hòa', 'đỗ xe', 'lễ tân 24h',
  'bar', 'kids club', 'phòng gym', 'sauna', 'tennis', 'KTV'
];

const SPOT_TYPES = [
  { value: SpotType.BEACH, label: 'Bãi biển' },
  { value: SpotType.MOUNTAIN, label: 'Núi' },
  { value: SpotType.HISTORICAL, label: 'Di tích' },
  { value: SpotType.WATERFALL, label: 'Thác nước' },
  { value: SpotType.ISLAND, label: 'Đảo' },
  { value: SpotType.LAKE, label: 'Hồ' },
  { value: SpotType.CAVE, label: 'Hang động' },
];

const REGIONS = [
  { value: Region.NORTH, label: 'Miền Bắc' },
  { value: Region.CENTRAL, label: 'Miền Trung' },
  { value: Region.SOUTH, label: 'Miền Nam' },
];

const STAR_RATINGS = [5, 4, 3, 2, 1];

const CUISINE_TYPES = [
  { value: CuisineType.VIETNAMESE, label: 'Việt' },
  { value: CuisineType.CHINESE, label: 'Trung' },
  { value: CuisineType.JAPANESE, label: 'Nhật' },
  { value: CuisineType.KOREAN, label: 'Hàn' },
  { value: CuisineType.ITALIAN, label: 'Ý' },
  { value: CuisineType.SEAFOOD, label: 'Hải sản' },
];

const PRICE_RANGES = [
  { value: PriceRange.BUDGET, label: 'Bình dân' },
  { value: PriceRange.MIDDLE, label: 'Trung cấp' },
  { value: PriceRange.HIGH, label: 'Cao cấp' },
];

const RESTAURANT_STYLES = [
  { value: RestaurantStyle.QUAN_AN, label: 'Quán ăn' },
  { value: RestaurantStyle.NHA_HANG, label: 'Nhà hàng' },
  { value: RestaurantStyle.CAFE, label: 'Cafe' },
  { value: RestaurantStyle.BAR, label: 'Bar' },
];

const RESORT_LOCATIONS = [
  { value: ResortLocationType.BEACH, label: 'Biển' },
  { value: ResortLocationType.MOUNTAIN, label: 'Núi' },
  { value: ResortLocationType.LAKE, label: 'Hồ' },
  { value: ResortLocationType.ISLAND, label: 'Đảo' },
];

const RESORT_TYPES = [
  { value: ResortType.BEACH, label: 'Biển' },
  { value: ResortType.MOUNTAIN, label: 'Núi' },
  { value: ResortType.ECOLOGICAL, label: 'Sinh thái' },
  { value: ResortType.SPA, label: 'Spa' },
];

// Tour filters (F051-F055)
const TOUR_DURATIONS = [
  { value: '1 ngày', label: '1 ngày' },
  { value: '2 ngày 1 đêm', label: '2 ngày 1 đêm' },
  { value: '3 ngày 2 đêm', label: '3 ngày 2 đêm' },
  { value: '4 ngày 3 đêm', label: '4 ngày 3 đêm' },
  { value: '5 ngày 4 đêm', label: '5 ngày 4 đêm' },
  { value: 'trên 5 ngày', label: 'Trên 5 ngày' },
];

// Transport filters (F056-F060)
const TRANSPORT_TYPES = [
  { value: 'máy bay', label: 'Máy bay' },
  { value: 'xe khách', label: 'Xe khách' },
  { value: 'tàu hỏa', label: 'Tàu hỏa' },
  { value: 'thuê xe', label: 'Thuê xe' },
  { value: 'limousine', label: 'Limousine' },
];

const SORT_OPTIONS = [
  { value: SortOption.RATING_DESC, label: 'Đánh giá cao nhất' },
  { value: SortOption.RATING_ASC, label: 'Đánh giá thấp nhất' },
  { value: SortOption.PRICE_ASC, label: 'Giá tăng dần' },
  { value: SortOption.PRICE_DESC, label: 'Giá giảm dần' },
  { value: SortOption.NAME_ASC, label: 'Tên A-Z' },
  { value: SortOption.NAME_DESC, label: 'Tên Z-A' },
  { value: SortOption.DISTANCE, label: 'Khoảng cách gần nhất' },
];

export default function FilterSidebar({ onFilterChange, currentType }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sort: true,
    price: true,
    rating: true,
    amenities: false,
    // Tour filter sections
    destination: false,
    duration: false,
    tourDate: false,
    // Transport filter sections
    transportType: false,
    departure: false,
    arrival: false,
    company: false,
    priceTransport: false,
  });

  const [filters, setFilters] = useState<FilterState>({
    starRating: [],
    priceRange: {},
    amenities: [],
    cuisineType: [],
    priceRangeRestaurant: [],
    style: [],
    locationType: [],
    resortType: [],
    transportType: [],
    company: [],
    sort: SortOption.RATING_DESC,
  });

  // Reset filters when type changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      starRating: [],
      priceRange: {},
      amenities: [],
      cuisineType: [],
      priceRangeRestaurant: [],
      style: [],
      locationType: [],
      resortType: [],
      transportType: [],
      company: [],
    }));
  }, [currentType]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: keyof FilterState, value: any) => {
    const current = (filters[key] as any[]) || [];
    const newValue = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, newValue);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      starRating: [],
      priceRange: {},
      amenities: [],
      cuisineType: [],
      priceRangeRestaurant: [],
      style: [],
      locationType: [],
      resortType: [],
      transportType: [],
      company: [],
      sort: SortOption.RATING_DESC,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = () => {
    return (
      filters.starRating?.length > 0 ||
      filters.amenities?.length > 0 ||
      filters.cuisineType?.length > 0 ||
      filters.priceRangeRestaurant?.length > 0 ||
      filters.style?.length > 0 ||
      filters.locationType?.length > 0 ||
      filters.resortType?.length > 0 ||
      filters.priceRange?.min ||
      filters.priceRange?.max
    );
  };

  const renderSpotFilters = () => (
    <>
      {/* Region Filter (F022) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('region')}
        >
          Vùng miền
          {expandedSections.region ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.region && (
          <div className="space-y-2">
            {REGIONS.map(region => (
              <label key={region.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="region"
                  checked={filters.region === region.value}
                  onChange={() => updateFilter('region', region.value)}
                  className="w-4 h-4 text-orange-500"
                />
                <span className="text-gray-600">{region.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Spot Type Filter (F022) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('spotType')}
        >
          Loại điểm đến
          {expandedSections.spotType ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.spotType && (
          <div className="space-y-2">
            {SPOT_TYPES.map(type => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="spotType"
                  checked={filters.spotType === type.value}
                  onChange={() => updateFilter('spotType', type.value)}
                  className="w-4 h-4 text-orange-500"
                />
                <span className="text-gray-600">{type.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderHotelFilters = () => (
    <>
      {/* Star Rating Filter (F025) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('starRating')}
        >
          Hạng sao
          {expandedSections.starRating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.starRating && (
          <div className="flex flex-wrap gap-2">
            {STAR_RATINGS.map(star => (
              <button
                key={star}
                onClick={() => toggleArrayFilter('starRating', star)}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  filters.starRating?.includes(star)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {star}★
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter (F024) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('price')}
        >
          Khoảng giá
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={filters.priceRange?.min || ''}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, min: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Đến"
                value={filters.priceRange?.max || ''}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, max: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="text-sm text-gray-500">VND</div>
          </div>
        )}
      </div>

      {/* Amenities Filter (F026) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('amenities')}
        >
          Tiện nghi
          {expandedSections.amenities ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.amenities && (
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map(amenity => (
              <button
                key={amenity}
                onClick={() => toggleArrayFilter('amenities', amenity)}
                className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                  filters.amenities?.includes(amenity)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderRestaurantFilters = () => (
    <>
      {/* Cuisine Type Filter (F030) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('cuisineType')}
        >
          Loại ẩm thực
          {expandedSections.cuisineType ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.cuisineType && (
          <div className="flex flex-wrap gap-2">
            {CUISINE_TYPES.map(cuisine => (
              <button
                key={cuisine.value}
                onClick={() => toggleArrayFilter('cuisineType', cuisine.value)}
                className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                  filters.cuisineType?.includes(cuisine.value)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {cuisine.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter (F029) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('priceRangeRestaurant')}
        >
          Mức giá
          {expandedSections.priceRangeRestaurant ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.priceRangeRestaurant && (
          <div className="space-y-2">
            {PRICE_RANGES.map(range => (
              <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.priceRangeRestaurant?.includes(range.value)}
                  onChange={() => toggleArrayFilter('priceRangeRestaurant', range.value)}
                  className="w-4 h-4 text-orange-500 rounded"
                />
                <span className="text-gray-600">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Style Filter */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('style')}
        >
          Phong cách
          {expandedSections.style ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.style && (
          <div className="flex flex-wrap gap-2">
            {RESTAURANT_STYLES.map(style => (
              <button
                key={style.value}
                onClick={() => toggleArrayFilter('style', style.value)}
                className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                  filters.style?.includes(style.value)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderResortFilters = () => (
    <>
      {/* Location Type Filter (F107) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('locationType')}
        >
          Vị trí
          {expandedSections.locationType ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.locationType && (
          <div className="flex flex-wrap gap-2">
            {RESORT_LOCATIONS.map(location => (
              <button
                key={location.value}
                onClick={() => toggleArrayFilter('locationType', location.value)}
                className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                  filters.locationType?.includes(location.value)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {location.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resort Type Filter (F109) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('resortType')}
        >
          Loại hình
          {expandedSections.resortType ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.resortType && (
          <div className="flex flex-wrap gap-2">
            {RESORT_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => toggleArrayFilter('resortType', type.value)}
                className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                  filters.resortType?.includes(type.value)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Star Rating */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('starRating')}
        >
          Hạng sao
          {expandedSections.starRating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.starRating && (
          <div className="flex flex-wrap gap-2">
            {STAR_RATINGS.map(star => (
              <button
                key={star}
                onClick={() => toggleArrayFilter('starRating', star)}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  filters.starRating?.includes(star)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {star}★
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // Tour Filters (F051-F055)
  const renderTourFilters = () => (
    <>
      {/* Destination Filter (F055) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('destination')}
        >
          Điểm đến
          {expandedSections.destination ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.destination && (
          <input
            type="text"
            placeholder="Nhập điểm đến..."
            value={filters.destination || ''}
            onChange={(e) => updateFilter('destination', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        )}
      </div>

      {/* Duration Filter (F053) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('duration')}
        >
          Thời gian
          {expandedSections.duration ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.duration && (
          <div className="flex flex-wrap gap-2">
            {TOUR_DURATIONS.map(d => (
              <button
                key={d.value}
                onClick={() => updateFilter('duration', d.value)}
                className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                  filters.duration === d.value
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Date Range Filter (F054) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('tourDate')}
        >
          Ngày khởi hành
          {expandedSections.tourDate ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.tourDate && (
          <div className="space-y-2">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => updateFilter('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <span className="text-gray-400 text-sm">đến</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => updateFilter('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        )}
      </div>

      {/* Price Range (F052) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('price')}
        >
          Khoảng giá
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.price && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={filters.priceRange.min || ''}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, min: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Đến"
                value={filters.priceRange.max || ''}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, max: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );

  // Transport Filters (F056-F060)
  const renderTransportFilters = () => (
    <>
      {/* Transport Type Filter (F057) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('transportType')}
        >
          Loại phương tiện
          {expandedSections.transportType ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.transportType && (
          <div className="flex flex-wrap gap-2">
            {TRANSPORT_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => toggleArrayFilter('transportType', type.value)}
                className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                  filters.transportType?.includes(type.value)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Departure Filter (F056) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('departure')}
        >
          Điểm đi
          {expandedSections.departure ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.departure && (
          <input
            type="text"
            placeholder="Nhập điểm đi..."
            value={filters.departure || ''}
            onChange={(e) => updateFilter('departure', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        )}
      </div>

      {/* Arrival Filter (F056) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('arrival')}
        >
          Điểm đến
          {expandedSections.arrival ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.arrival && (
          <input
            type="text"
            placeholder="Nhập điểm đến..."
            value={filters.arrival || ''}
            onChange={(e) => updateFilter('arrival', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        )}
      </div>

      {/* Company Filter (F059) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('company')}
        >
          Nhà xe/Hãng
          {expandedSections.company ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.company && (
          <input
            type="text"
            placeholder="Nhập nhà xe hoặc hãng..."
            value={filters.company?.[0] || ''}
            onChange={(e) => updateFilter('company', e.target.value ? [e.target.value] : [])}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        )}
      </div>

      {/* Price Range (F058) */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
          onClick={() => toggleSection('priceTransport')}
        >
          Khoảng giá
          {expandedSections.priceTransport ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.priceTransport && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={filters.priceRange.min || ''}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, min: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Đến"
                value={filters.priceRange.max || ''}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, max: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderFiltersForType = () => {
    switch (currentType) {
      case SearchType.SPOT:
        return renderSpotFilters();
      case SearchType.HOTEL:
        return renderHotelFilters();
      case SearchType.RESTAURANT:
        return renderRestaurantFilters();
      case SearchType.RESORT:
        return renderResortFilters();
      case SearchType.TOUR:
        return renderTourFilters();
      case SearchType.TRANSPORT:
        return renderTransportFilters();
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg mb-4"
      >
        <SlidersHorizontal size={18} />
        Bộ lọc
        {hasActiveFilters() && (
          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-0 z-40 lg:z-auto
        lg:block lg:w-64 lg:flex-shrink-0
        bg-white lg:bg-transparent
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full lg:h-auto overflow-y-auto p-4 lg:p-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Bộ lọc</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Xóa tất cả
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Sort (F036) */}
          <div className="mb-6">
            <button 
              className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
              onClick={() => toggleSection('sort')}
            >
              Sắp xếp
              {expandedSections.sort ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.sort && (
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Rating Filter (F043) */}
          <div className="mb-6">
            <button 
              className="flex items-center justify-between w-full font-semibold text-gray-700 mb-3"
              onClick={() => toggleSection('rating')}
            >
              Đánh giá
              {expandedSections.rating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.rating && (
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="minRating"
                      checked={filters.minRating === rating}
                      onChange={() => updateFilter('minRating', rating)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                      <span className="ml-1 text-gray-500 text-sm">trở lên</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Type-specific filters */}
          {renderFiltersForType()}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
