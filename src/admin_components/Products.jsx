import React, { useState } from 'react';
import AddPurchase from './sub_admins/AddPurchase';
import ProductDashboard from './sub_admins/ProductDashboard';
import Filters from './sub_admins/Filters';

const ProductComponent = () => {
  const [currentTab, setCurrentTab] = useState('components');
  const [currentViewMode, setCurrentViewMode] = useState('product');

  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const handleAddPurchaseClick = () => setShowAddPurchase(true);
  const handleCloseAddPurchase = () => setShowAddPurchase(false);
  const handleFilterClick = () => setShowFilters(prev => !prev);

  return (
    <div className="bg-gray-200 p-4 w-screen md:w-full h-auto mx-auto">
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={handleAddPurchaseClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          Add Purchase
        </button>
      </div>

      <div className="flex justify-end items-center gap-5 mb-4">
        {/* <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center">
          Download XLS
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center">
          Download CSV
        </button> */}
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center"
          onClick={handleFilterClick}
        >
          Filter
        </button>
      </div>

      {showFilters && (
        <div className="w-full  mt-4 md:flex justify-end ">
          <Filters
            activeTab={currentTab}
            viewMode={currentViewMode}
            onSearch={setSearchQuery}
            onDateRange={setDateRange}
          />
        </div>
      )}

      <div className="border border-gray-300 rounded-md bg-gray-50 h-full p-4">
        <ProductDashboard
          onTabChange={setCurrentTab}
          onViewModeChange={setCurrentViewMode}
          viewMode={currentViewMode}
          searchQuery={searchQuery}
          dateRange={dateRange}
          filtersEnabled={showFilters} // ✅ add this
        />


      </div>

      {showAddPurchase && (
        <AddPurchase onClose={handleCloseAddPurchase} />
      )}
    </div>
  );
};

export default ProductComponent;
