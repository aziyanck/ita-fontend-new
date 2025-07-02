import React from 'react';

const Filters = ({ activeTab, viewMode }) => {
  const renderSearchLabel = () => {
    if (activeTab === 'components') {
      return viewMode === 'category' ? 'Search by Category' : 'Search by Product';
    } else if (activeTab === 'purchase' || activeTab === 'sell') {
      return 'Search by Invoice Number';
    }
    return 'Search';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filter</h2>

      {/* ✅ Date filters only for purchase/sell tabs */}
      {(activeTab === 'purchase' || activeTab === 'sell') && (
        <div className="mb-4 flex space-x-2">
          <div className="w-1/2">
            <label htmlFor="dateFrom" className="block text-gray-700 text-sm font-bold mb-2">
              Date From
            </label>
            <input
              type="date"
              id="dateFrom"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="dateTo" className="block text-gray-700 text-sm font-bold mb-2">
              To
            </label>
            <input
              type="date"
              id="dateTo"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="searchInput" className="block text-gray-700 text-sm font-bold mb-2">
          {renderSearchLabel()}
        </label>
        <input
          type="text"
          id="searchInput"
          placeholder="Enter search text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    </div>
  );
};

export default Filters;
