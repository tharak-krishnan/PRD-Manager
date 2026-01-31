import React, { useMemo, useState } from 'react';
import { useData, Feature } from '../context/DataContext';
import { Download } from 'lucide-react';
import { apiClient } from '../services/api';
const Roadmap: React.FC = () => {
  const {
    categories
  } = useData();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  // Generate a color for each category
  const categoryColors = useMemo(() => {
    const colors = ['bg-blue-900/50 border-blue-700/50 text-blue-300', 'bg-green-900/50 border-green-700/50 text-green-300', 'bg-purple-900/50 border-purple-700/50 text-purple-300', 'bg-yellow-900/50 border-yellow-700/50 text-yellow-300', 'bg-pink-900/50 border-pink-700/50 text-pink-300', 'bg-indigo-900/50 border-indigo-700/50 text-indigo-300', 'bg-red-900/50 border-red-700/50 text-red-300', 'bg-orange-900/50 border-orange-700/50 text-orange-300', 'bg-teal-900/50 border-teal-700/50 text-teal-300', 'bg-cyan-900/50 border-cyan-700/50 text-cyan-300'];
    return categories.reduce((acc, category, index) => {
      acc[category.id] = colors[index % colors.length];
      return acc;
    }, {} as Record<string, string>);
  }, [categories]);
  // Get all features with release dates (both signed off and pending)
  const featuresWithDates = useMemo(() => {
    return categories.flatMap(category => category.features.filter(feature => feature.releaseDate).map(feature => ({
      ...feature,
      categoryId: category.id,
      categoryName: category.name
    })));
  }, [categories]);
  // Helper function to convert YYYY-MM to quarter (YYYY-Q1, YYYY-Q2, etc.)
  const getQuarterFromDate = (dateStr: string): string => {
    const [year, month] = dateStr.split('-');
    const monthNum = parseInt(month);
    const quarter = Math.ceil(monthNum / 3);
    return `${year}-Q${quarter}`;
  };

  // Get all unique quarters in the date range
  const quarters = useMemo(() => {
    if (featuresWithDates.length === 0) return [];
    const dates = featuresWithDates.map(f => f.releaseDate);
    const sortedDates = [...dates].sort();
    // If no dates, return empty array
    if (sortedDates.length === 0 || !sortedDates[0]) return [];
    // Get the earliest and latest dates
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);
    // Add 1 quarter to the end date for better visualization
    endDate.setMonth(endDate.getMonth() + 3);
    const result = new Set<string>();
    const currentDate = new Date(startDate);
    // Generate all quarters between start and end dates
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const quarter = `${year}-${month.toString().padStart(2, '0')}`;
      result.add(getQuarterFromDate(quarter));
      currentDate.setMonth(currentDate.getMonth() + 3);
    }
    return Array.from(result).sort();
  }, [featuresWithDates]);

  // Group features by quarter
  const featuresByQuarter = useMemo(() => {
    return quarters.reduce((acc, quarter) => {
      acc[quarter] = featuresWithDates.filter(feature =>
        getQuarterFromDate(feature.releaseDate) === quarter
      );
      return acc;
    }, {} as Record<string, Array<Feature & {
      categoryId: string;
      categoryName: string;
    }>>);
  }, [quarters, featuresWithDates]);

  // Format quarter for display
  const formatQuarter = (quarterStr: string) => {
    const [year, quarter] = quarterStr.split('-');
    return `${quarter} ${year}`;
  };

  // Handle PowerPoint export
  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const blob = await apiClient.exportRoadmapPptx();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `roadmap_${new Date().toISOString().split('T')[0]}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setExportError(error.response?.data?.error || 'Failed to export roadmap');
    } finally {
      setIsExporting(false);
    }
  };

  if (quarters.length === 0) {
    return <div className="w-full p-8 text-center bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Roadmap</h2>
        <p className="text-gray-400">
          No features with release dates available. Add features with release dates to see the roadmap.
        </p>
      </div>;
  }
  return <div className="w-full overflow-x-auto">
      <div className="mb-4">
        <button
          onClick={handleExport}
          disabled={isExporting || quarters.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isExporting || quarters.length === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Download size={16} />
          {isExporting ? 'Exporting...' : 'Export to PowerPoint'}
        </button>
      </div>
      {exportError && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-400 text-sm">
          {exportError}
        </div>
      )}
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Product Roadmap
      </h2>

      {/* Legend */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-6 mb-4 pb-4 border-b border-gray-700">
          {/* Category Legend */}
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const hasFeatures = featuresWithDates.some(f => f.categoryId === category.id);
              if (!hasFeatures) return null;
              const colorClass = categoryColors[category.id].split(' ')[0];
              return <div key={category.id} className="flex items-center" title={category.name}>
                    <div className={`w-4 h-4 rounded mr-2 flex-shrink-0 ${colorClass}`}></div>
                    <span className="text-sm text-gray-300">{category.name}</span>
                  </div>;
            })}
          </div>

          {/* Status Legend */}
          <div className="flex gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-12 h-6 border border-gray-500 rounded bg-gray-800/50"></div>
              <span className="text-xs text-gray-400">Signed Off</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-6 border-2 border-dashed border-gray-500 rounded bg-gray-800/50 flex items-center justify-center">
                <span className="text-xs">⏳</span>
              </div>
              <span className="text-xs text-gray-400">Pending Estimation</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative border border-gray-700 rounded-lg bg-gray-800 p-5 min-h-[400px] shadow-lg">
        {/* Timeline header */}
        <div className="flex border-b border-gray-700 pb-3">
          <div className="w-48 flex-shrink-0"></div>
          <div className="flex-1 flex">
            {quarters.map(quarter => <div key={quarter} className="flex-1 text-center text-sm font-medium text-gray-300">
                {formatQuarter(quarter)}
              </div>)}
          </div>
        </div>
        {/* Timeline content */}
        <div className="mt-5 relative">
          {/* Vertical quarter separators */}
          <div className="absolute inset-0 flex pointer-events-none">
            <div className="w-48 flex-shrink-0"></div>
            <div className="flex-1 flex">
              {quarters.map((quarter) => <div key={quarter} className="flex-1 border-r border-gray-700/50 h-full"></div>)}
            </div>
          </div>
          {/* Features by category */}
          {categories.map((category) => {
          const hasFeatures = featuresWithDates.some(f => f.categoryId === category.id);
          if (!hasFeatures) return null;
          return <div key={category.id} className="flex mb-6 relative z-10">
                <div className="w-48 flex-shrink-0 pr-4 flex items-center" title={category.name}>
                  <span className="text-sm font-medium truncate text-gray-300">
                    {category.name}
                  </span>
                </div>
                <div className="flex-1 flex">
                  {quarters.map(quarter => {
                const featuresInQuarter = featuresByQuarter[quarter]?.filter(f => f.categoryId === category.id) || [];
                return <div key={quarter} className="flex-1 px-1 overflow-hidden">
                        {featuresInQuarter.map(feature => {
                      // Use dotted border for features without engineering signoff
                      const borderStyle = feature.engineeringSignoff ? 'border' : 'border-dashed border-2';
                      const titlePrefix = feature.engineeringSignoff ? '' : '⏳ ';
                      // Priority colors
                      const priorityColor = feature.priority === 'High'
                        ? 'text-red-400'
                        : feature.priority === 'Medium'
                        ? 'text-yellow-400'
                        : 'text-green-400';
                      return <div key={feature.id} className={`mb-2 p-2 rounded ${borderStyle} text-xs ${categoryColors[category.id]} w-full`} title={`${feature.engineeringSignoff ? 'Signed Off' : 'Pending Estimation'}: ${feature.title} - ${feature.priority} Priority`}>
                              <div className="font-medium truncate w-full">
                                {titlePrefix}{feature.title}
                              </div>
                              <div className="flex justify-end mt-1 w-full">
                                <div className={`text-xs font-bold ${priorityColor} flex-shrink-0`}>
                                  {feature.priority[0]}
                                </div>
                              </div>
                            </div>;
                    })}
                      </div>;
              })}
                </div>
              </div>;
        })}
        </div>
      </div>
    </div>;
};
export default Roadmap;