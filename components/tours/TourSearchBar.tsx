"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, MapPin } from "lucide-react";
import { popularDestinations } from "@/types/tours";

interface TourSearchBarProps {
  initialValue?: string;
  className?: string;
  placeholder?: string;
}

export default function TourSearchBar({ 
  initialValue = "",
  className = "",
  placeholder = "Tìm kiếm tour, điểm đến..."
}: TourSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchValue, setSearchValue] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.length >= 2) {
        // Filter destinations that match search
        const filtered = popularDestinations
          .filter(d => d.name.toLowerCase().includes(searchValue.toLowerCase()))
          .map(d => d.name);
        setSuggestions(filtered.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    
    // Reset to page 1 when searching
    params.set("page", "1");
    
    router.push(`/tours?${params.toString()}`);
    setShowSuggestions(false);
  }, [searchValue, searchParams, router]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", suggestion);
    params.set("page", "1");
    
    router.push(`/tours?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchValue("");
    setSuggestions([]);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("page", "1");
    
    router.push(`/tours?${params.toString()}`);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch}>
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="absolute left-4 text-gray-400">
            <Search className="w-5 h-5" />
          </div>

          {/* Input */}
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="w-full pl-12 pr-24 py-4 bg-white border-2 border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-lg"
          />

          {/* Clear Button */}
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-14 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors duration-200"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
            <div className="p-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                Điểm đến gợi ý
              </p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-orange-50 rounded-xl transition-colors"
                >
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-sm text-gray-500">Phổ biến:</span>
        {popularDestinations.slice(0, 5).map((destination) => (
          <button
            key={destination.id}
            onClick={() => handleSuggestionClick(destination.name)}
            className="text-sm px-3 py-1 bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 rounded-full transition-colors"
          >
            {destination.name}
          </button>
        ))}
      </div>
    </div>
  );
}
