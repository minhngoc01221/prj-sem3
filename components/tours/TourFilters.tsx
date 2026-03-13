"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar,
  ChevronDown,
  X,
  Filter
} from "lucide-react";
import { 
  popularDestinations, 
  tourDurationLabels, 
  TourDuration,
  defaultPriceRange,
  priceStep 
} from "@/types/tours";

interface TourFiltersProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function TourFilters({ className = "", isMobile = false, onClose }: TourFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter states
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(() => {
    const destinations = searchParams.get("destinations");
    return destinations ? destinations.split(",") : [];
  });

  const [selectedDuration, setSelectedDuration] = useState<TourDuration | null>(() => {
    const duration = searchParams.get("duration");
    return duration as TourDuration | null;
  });

  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    return [
      minPrice ? parseInt(minPrice) : defaultPriceRange[0],
      maxPrice ? parseInt(maxPrice) : defaultPriceRange[1]
    ];
  });

  const [startDate, setStartDate] = useState<string>(() => {
    return searchParams.get("startDate") || "";
  });

  const [expandedSections, setExpandedSections] = useState({
    destination: true,
    duration: true,
    price: true,
    date: true,
  });

  // Sync with URL
  useEffect(() => {
    const destinations = searchParams.get("destinations");
    setSelectedDestinations(destinations ? destinations.split(",") : []);

    const duration = searchParams.get("duration");
    setSelectedDuration(duration as TourDuration | null);

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    setPriceRange([
      minPrice ? parseInt(minPrice) : defaultPriceRange[0],
      maxPrice ? parseInt(maxPrice) : defaultPriceRange[1]
    ]);

    const startDateParam = searchParams.get("startDate");
    setStartDate(startDateParam || "");
  }, [searchParams]);

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Destinations
    if (selectedDestinations.length > 0) {
      params.set("destinations", selectedDestinations.join(","));
    } else {
      params.delete("destinations");
    }

    // Duration
    if (selectedDuration) {
      params.set("duration", selectedDuration);
    } else {
      params.delete("duration");
    }

    // Price range
    if (priceRange[0] !== defaultPriceRange[0] || priceRange[1] !== defaultPriceRange[1]) {
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    // Start date
    if (startDate) {
      params.set("startDate", startDate);
    } else {
      params.delete("startDate");
    }

    // Reset to page 1
    params.set("page", "1");

    router.push(`/tours?${params.toString()}`);
  }, [selectedDestinations, selectedDuration, priceRange, startDate, searchParams, router]);

  const handleDestinationToggle = (destination: string) => {
    setSelectedDestinations(prev => 
      prev.includes(destination)
        ? prev.filter(d => d !== destination)
        : [...prev, destination]
    );
  };

  const handleDurationSelect = (duration: TourDuration) => {
    setSelectedDuration(prev => prev === duration ? null : duration);
  };

  const handleClearFilters = () => {
    setSelectedDestinations([]);
    setSelectedDuration(null);
    setPriceRange(defaultPriceRange);
    setStartDate("");

    const params = new URLSearchParams();
    router.push("/tours");
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = 
    selectedDestinations.length > 0 || 
    selectedDuration !== null ||
    priceRange[0] !== defaultPriceRange[0] || 
    priceRange[1] !== defaultPriceRange[1] ||
    startDate !== "";

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}tr`;
    }
    return value.toLocaleString("vi-VN");
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
              {selectedDestinations.length + (selectedDuration ? 1 : 0) + (startDate ? 1 : 0) + (priceRange[0] !== defaultPriceRange[0] || priceRange[1] !== defaultPriceRange[1] ? 1 : 0)}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Mobile Close Button */}
      {isMobile && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Destination Filter (F069) */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("destination")}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900">Điểm đến</span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSections.destination ? "rotate-180" : ""
              }`} 
            />
          </button>
          
          {expandedSections.destination && (
            <div className="mt-3 space-y-2">
              {popularDestinations.map((destination) => (
                <label
                  key={destination.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedDestinations.includes(destination.slug)}
                    onChange={() => handleDestinationToggle(destination.slug)}
                    className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">{destination.name}</span>
                  <span className="text-xs text-gray-400">({destination.tourCount})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Duration Filter (F070) */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("duration")}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900">Thời gian</span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSections.duration ? "rotate-180" : ""
              }`} 
            />
          </button>
          
          {expandedSections.duration && (
            <div className="mt-3 space-y-2">
              {(Object.keys(tourDurationLabels) as TourDuration[]).map((duration) => (
                <label
                  key={duration}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedDuration === duration 
                      ? "bg-orange-50 border border-orange-200" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    checked={selectedDuration === duration}
                    onChange={() => handleDurationSelect(duration)}
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{tourDurationLabels[duration]}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter (F071) */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900">Khoảng giá</span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSections.price ? "rotate-180" : ""
              }`} 
            />
          </button>
          
          {expandedSections.price && (
            <div className="mt-3">
              {/* Price Range Display */}
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium text-orange-600">
                  {formatPrice(priceRange[0])}đ
                </span>
                <span className="font-medium text-orange-600">
                  {formatPrice(priceRange[1])}đ
                </span>
              </div>
              
              {/* Range Slider */}
              <div className="space-y-3">
                <input
                  type="range"
                  min={defaultPriceRange[0]}
                  max={defaultPriceRange[1]}
                  step={priceStep}
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value < priceRange[1]) {
                      setPriceRange([value, priceRange[1]]);
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <input
                  type="range"
                  min={defaultPriceRange[0]}
                  max={defaultPriceRange[1]}
                  step={priceStep}
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > priceRange[0]) {
                      setPriceRange([priceRange[0], value]);
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Quick Price Presets */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setPriceRange([0, 5000000])}
                  className={`text-xs px-2 py-1 rounded-full ${
                    priceRange[0] === 0 && priceRange[1] === 5000000
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Dưới 5tr
                </button>
                <button
                  onClick={() => setPriceRange([5000000, 10000000])}
                  className={`text-xs px-2 py-1 rounded-full ${
                    priceRange[0] === 5000000 && priceRange[1] === 10000000
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  5-10tr
                </button>
                <button
                  onClick={() => setPriceRange([10000000, 20000000])}
                  className={`text-xs px-2 py-1 rounded-full ${
                    priceRange[0] === 10000000 && priceRange[1] === 20000000
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  10-20tr
                </button>
                <button
                  onClick={() => setPriceRange([20000000, 50000000])}
                  className={`text-xs px-2 py-1 rounded-full ${
                    priceRange[0] === 20000000 && priceRange[1] === 50000000
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  20-50tr
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Start Date Filter (F072) */}
        <div>
          <button
            onClick={() => toggleSection("date")}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900">Ngày khởi hành</span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSections.date ? "rotate-180" : ""
              }`} 
            />
          </button>
          
          {expandedSections.date && (
            <div className="mt-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
              {startDate && (
                <button
                  onClick={() => setStartDate("")}
                  className="mt-2 text-sm text-orange-600 hover:text-orange-700"
                >
                  Xóa ngày chọn
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apply Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={updateFilters}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );
}
