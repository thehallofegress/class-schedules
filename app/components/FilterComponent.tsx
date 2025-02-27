"use client";
import React, { useState } from 'react';

interface FilterProps {
  selectedClassType: string;
  setSelectedClassType: (type: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  classTypes: Array<{ id: string; name: string }>;
}

const FilterComponent: React.FC<FilterProps> = ({
  selectedClassType,
  setSelectedClassType,
  selectedLocation,
  setSelectedLocation,
  classTypes,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const locations = ['all', 'San Jose', 'Mountain View'];

  const clearFilters = () => {
    setSelectedClassType('all');
    setSelectedLocation('all');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedClassType !== 'all') count++;
    if (selectedLocation !== 'all') count++;
    return count;
  };
  
  const hasActiveFilters = selectedClassType !== 'all' || selectedLocation !== 'all';

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">🔍 筛选课程</h2>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
          {hasActiveFilters && (<button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
              aria-label="清除所有筛选"
            >
               ✖️ 重置
            </button>
            )}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-gray-600 hover:text-gray-900"
                aria-expanded={isExpanded}
            >
                {isExpanded ? '收起' : '展开'}
            </button>

        </div>
        </div>

        {isExpanded && (<div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 mt-2 text-left">课程类型</h3>
            <div className="flex flex-wrap gap-2">
              {classTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedClassType(type.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                    ${selectedClassType === type.id
                      ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-1'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  aria-pressed={selectedClassType === type.id}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">上课地点</h3>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                    ${selectedLocation === loc
                      ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-1'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  aria-pressed={selectedLocation === loc}
                >
                  {loc === 'all' ? '所有地点' : loc}
                </button>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 rounded-b-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>当前筛选:</span>
            <div className="flex flex-wrap gap-2">
              {selectedClassType !== 'all' && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                  {classTypes.find(t => t.id === selectedClassType)?.name}
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                  {selectedLocation}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
