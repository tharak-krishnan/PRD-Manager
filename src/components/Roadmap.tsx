import React, { useMemo } from 'react';
import { useData, Category, Feature } from '../context/DataContext';
const Roadmap: React.FC = () => {
  const {
    categories
  } = useData();
  // Generate a color for each category
  const categoryColors = useMemo(() => {
    const colors = ['bg-blue-900/30 border-blue-700/50 text-blue-400', 'bg-green-900/30 border-green-700/50 text-green-400', 'bg-purple-900/30 border-purple-700/50 text-purple-400', 'bg-yellow-900/30 border-yellow-700/50 text-yellow-400', 'bg-pink-900/30 border-pink-700/50 text-pink-400', 'bg-indigo-900/30 border-indigo-700/50 text-indigo-400', 'bg-red-900/30 border-red-700/50 text-red-400', 'bg-orange-900/30 border-orange-700/50 text-orange-400', 'bg-teal-900/30 border-teal-700/50 text-teal-400', 'bg-cyan-900/30 border-cyan-700/50 text-cyan-400'];
    return categories.reduce((acc, category, index) => {
      acc[category.id] = colors[index % colors.length];
      return acc;
    }, {} as Record<string, string>);
  }, [categories]);
  // Get all features with release dates
  const featuresWithDates = useMemo(() => {
    return categories.flatMap(category => category.features.filter(feature => feature.releaseDate).map(feature => ({
      ...feature,
      categoryId: category.id,
      categoryName: category.name
    })));
  }, [categories]);
  // Get all unique months in the date range
  const months = useMemo(() => {
    if (featuresWithDates.length === 0) return [];
    const dates = featuresWithDates.map(f => f.releaseDate);
    const sortedDates = [...dates].sort();
    // If no dates, return empty array
    if (sortedDates.length === 0 || !sortedDates[0]) return [];
    // Get the earliest and latest dates
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);
    // Add 2 months to the end date for better visualization
    endDate.setMonth(endDate.getMonth() + 2);
    const result = [];
    const currentDate = new Date(startDate);
    // Generate all months between start and end dates
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      result.push(`${year}-${month.toString().padStart(2, '0')}`);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return result;
  }, [featuresWithDates]);
  // Group features by month
  const featuresByMonth = useMemo(() => {
    return months.reduce((acc, month) => {
      acc[month] = featuresWithDates.filter(feature => feature.releaseDate === month);
      return acc;
    }, {} as Record<string, Array<Feature & {
      categoryId: string;
      categoryName: string;
    }>>);
  }, [months, featuresWithDates]);
  // Format month for display
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };
  if (months.length === 0) {
    return <div className="w-full p-8 text-center bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Roadmap</h2>
        <p className="text-gray-400">
          No features with release dates available. Add features with release
          dates to see the roadmap.
        </p>
      </div>;
  }
  return <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">
        Product Roadmap
      </h2>
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          {categories.map(category => {
          const hasFeatures = featuresWithDates.some(f => f.categoryId === category.id);
          if (!hasFeatures) return null;
          const colorClass = categoryColors[category.id].split(' ')[0];
          return <div key={category.id} className="flex items-center">
                <div className={`w-4 h-4 rounded mr-2 ${colorClass}`}></div>
                <span className="text-sm text-gray-300">{category.name}</span>
              </div>;
        })}
        </div>
      </div>
      <div className="relative border border-gray-700 rounded-lg bg-gray-800 p-5 min-h-[400px] shadow-lg">
        {/* Timeline header */}
        <div className="flex border-b border-gray-700 pb-3">
          <div className="w-48 flex-shrink-0"></div>
          <div className="flex-1 flex">
            {months.map(month => <div key={month} className="flex-1 text-center text-sm font-medium text-gray-300">
                {formatMonth(month)}
              </div>)}
          </div>
        </div>
        {/* Timeline content */}
        <div className="mt-5 relative">
          {/* Vertical month separators */}
          <div className="absolute inset-0 flex pointer-events-none">
            <div className="w-48 flex-shrink-0"></div>
            <div className="flex-1 flex">
              {months.map((month, index) => <div key={month} className="flex-1 border-r border-gray-700/50 h-full"></div>)}
            </div>
          </div>
          {/* Features by category */}
          {categories.map((category, categoryIndex) => {
          const hasFeatures = featuresWithDates.some(f => f.categoryId === category.id);
          if (!hasFeatures) return null;
          return <div key={category.id} className="flex mb-6 relative z-10">
                <div className="w-48 flex-shrink-0 pr-4 flex items-center">
                  <span className="text-sm font-medium truncate text-gray-300">
                    {category.name}
                  </span>
                </div>
                <div className="flex-1 flex">
                  {months.map(month => {
                const featuresInMonth = featuresByMonth[month]?.filter(f => f.categoryId === category.id) || [];
                return <div key={month} className="flex-1 px-1">
                        {featuresInMonth.map(feature => <div key={feature.id} className={`mb-2 p-2 rounded border text-xs ${categoryColors[category.id]}`} title={`${feature.title} (${feature.id})`}>
                            <div className="font-medium truncate">
                              {feature.title}
                            </div>
                            <div className="text-xs opacity-75">
                              {feature.id}
                            </div>
                          </div>)}
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