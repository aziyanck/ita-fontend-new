import React from 'react';

const Filters = ({ activeTab, viewMode }) => {
  // Determine search label and placeholder dynamically:
  let searchLabel = '';
  let searchPlaceholder = '';

  if (activeTab === 'components') {
    if (viewMode === 'category') {
      searchLabel = 'Search by Category';
      searchPlaceholder = 'Enter category name';
    } else {
      searchLabel = 'Search by Product';
      searchPlaceholder = 'Enter product name';
    }
  } else if (activeTab === 'purchase' || activeTab === 'sell') {
    searchLabel = 'Search by Invoice Number';
    searchPlaceholder = 'Enter invoice number';
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filter</h2>

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
          {searchLabel}
        </label>
        <input
          type="text"
          id="searchInput"
          placeholder={searchPlaceholder}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    </div>
  );
};

export default Filters;
