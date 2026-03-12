// Search Bar with Autocomplete
// F040: Search bar with autocomplete

"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Building2, Utensils, Palmtree, Loader2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAutocomplete, useSearchHistory } from '@/hooks/useSearch';
import { SearchType, AutocompleteSuggestion } from '@/types/search';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  onSearch?: (query: string, type: SearchType) => void;
}

const TYPE_LABELS: Record<SearchType, string> = {
  [SearchType.SPOT]: 'Điểm du lịch',
  [SearchType.HOTEL]: 'Khách sạn',
  [SearchType.RESTAURANT]: 'Nhà hàng',
  [SearchType.RESORT]: 'Resort',
  [SearchType.TRANSPORT]: 'Vận chuyển',
  [SearchType.TOUR]: 'Tour',
};

const TYPE_ICONS: Record<SearchType, any> = {
  [SearchType.SPOT]: MapPin,
  [SearchType.HOTEL]: Building2,
  [SearchType.RESTAURANT]: Utensils,
  [SearchType.RESORT]: Palmtree,
  [SearchType.TRANSPORT]: MapPin,
  [SearchType.TOUR]: MapPin,
};

export default function SearchBar({ variant = 'hero', onSearch }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SearchType>(SearchType.SPOT);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { suggestions, isLoading, search, clearSuggestions } = useAutocomplete();
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  // Debounced autocomplete search
  useEffect(() => {
    if (query.length >= 2) {
      const timer = setTimeout(() => {
        search(query);
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      clearSuggestions();
      setIsOpen(false);
    }
  }, [query, search, clearSuggestions]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    // Save to history (F039)
    addToHistory(finalQuery, selectedType);

    // Trigger search callback or navigate
    if (onSearch) {
      onSearch(finalQuery, selectedType);
    } else {
      router.push(`/search?query=${encodeURIComponent(finalQuery)}&type=${selectedType}`);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    setQuery(suggestion.name);
    router.push(`/${suggestion.type}s/${suggestion.id}`);
    setIsOpen(false);
  };

  const handleHistoryClick = (item: { query: string; type: SearchType }) => {
    setQuery(item.query);
    setSelectedType(item.type);
    handleSearch(item.query);
  };

  return (
    <div className={`w-full ${variant === 'hero' ? 'max-w-2xl' : 'max-w-lg'}`}>
      <div className="bg-white rounded-full shadow-lg flex items-center overflow-hidden">
        {/* Search Input */}
        <div className="flex-1 flex items-center px-4">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Tìm kiếm điểm du lịch, khách sạn, nhà hàng..."
            className="w-full py-4 outline-none text-gray-700 placeholder-gray-400"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                clearSuggestions();
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Type Selector */}
        <div className="relative border-l border-gray-200">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as SearchType)}
            className="appearance-none bg-transparent py-4 pl-4 pr-10 outline-none font-medium text-gray-700 cursor-pointer"
          >
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 font-semibold transition-colors"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {isLoading ? (
            <div className="p-4 flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang tìm kiếm...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {/* Suggestions by type */}
              {Object.values(SearchType).map(type => {
                const typeSuggestions = suggestions.filter(s => s.type === type);
                if (typeSuggestions.length === 0) return null;
                return (
                  <div key={type} className="border-b border-gray-100 last:border-0">
                    <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                      {TYPE_LABELS[type]} ({typeSuggestions.length})
                    </div>
                    {typeSuggestions.slice(0, 3).map(suggestion => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-orange-50 transition-colors text-left"
                      >
                        {suggestion.image ? (
                          <img 
                            src={suggestion.image} 
                            alt={suggestion.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            {(() => {
                              const Icon = TYPE_ICONS[suggestion.type];
                              return <Icon className="w-5 h-5 text-gray-400" />;
                            })()}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{suggestion.name}</div>
                          <div className="text-sm text-gray-500">{suggestion.subtext}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy kết quả nào
            </div>
          ) : null}

          {/* Search History (F039) */}
          {history.length > 0 && !query && (
            <div className="border-t border-gray-100">
              <div className="px-4 py-2 bg-gray-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Lịch sử tìm kiếm
                </span>
                <button 
                  onClick={clearHistory}
                  className="text-xs text-orange-500 hover:text-orange-600"
                >
                  Xóa
                </button>
              </div>
              {history.slice(0, 5).map(item => (
                <button
                  key={item.id}
                  onClick={() => handleHistoryClick(item)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-orange-50 transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-gray-700">{item.query}</span>
                  <span className="text-xs text-gray-400">{TYPE_LABELS[item.type]}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
