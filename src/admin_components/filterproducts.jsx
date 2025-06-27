import React, { useState, useEffect } from 'react';

function FilterProducts({ products, onFilter }) {
  const [filters, setFilters] = useState({
    invoiceNo: '',
    productName: '',
    distributor: '',
    hsn: '',
    dateFrom: '',
    dateTo: '',
  });

  const uniqueDistributors = [...new Set(products.map(p => p.distributor))].sort();
  const uniqueProductNames = [...new Set(products.map(p => p.product_name))].sort();
  const uniqueHsnCodes = [...new Set(products.map(p => p.hsn))].sort();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...products];

      if (filters.invoiceNo) {
        filtered = filtered.filter(p =>
          String(p.invoice_no).includes(filters.invoiceNo)
        );
      }
      if (filters.productName && filters.productName !== '') { // 'All' என்பதை '' ஆக மாற்றப்பட்டுள்ளது
        filtered = filtered.filter(p =>
          p.product_name.toLowerCase() === filters.productName.toLowerCase()
        );
      }
      if (filters.distributor && filters.distributor !== '') { // 'All' என்பதை '' ஆக மாற்றப்பட்டுள்ளது
        filtered = filtered.filter(p =>
          p.distributor.toLowerCase() === filters.distributor.toLowerCase()
        );
      }
      if (filters.hsn && filters.hsn !== '') { // 'All' என்பதை '' ஆக மாற்றப்பட்டுள்ளது
        filtered = filtered.filter(p =>
          String(p.hsn).toLowerCase() === filters.hsn.toLowerCase()
        );
      }
      if (filters.dateFrom) {
        filtered = filtered.filter(p => p.date >= filters.dateFrom);
      }
      if (filters.dateTo) {
        filtered = filtered.filter(p => p.date <= filters.dateTo);
      }

      onFilter(filtered);
    };

    applyFilters();
  }, [filters, products, onFilter]);

  const handleClearFilters = () => {
    setFilters({
      invoiceNo: '',
      productName: '',
      distributor: '',
      hsn: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter Purchases</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="invoiceNo" className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
          <input
            type="text"
            id="invoiceNo"
            name="invoiceNo"
            value={filters.invoiceNo}
            onChange={handleFilterChange}
            placeholder="Search by Invoice No"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" // text-black added
          />
        </div>

        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <select
            id="productName"
            name="productName"
            value={filters.productName}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" // text-black added
          >
            <option value="">All Products</option>
            {uniqueProductNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="distributor" className="block text-sm font-medium text-gray-700 mb-1">Distributor</label>
          <select
            id="distributor"
            name="distributor"
            value={filters.distributor}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" // text-black added
          >
            <option value="">All Distributors</option>
            {uniqueDistributors.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="hsn" className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
          <select
            id="hsn"
            name="hsn"
            value={filters.hsn}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" // text-black added
          >
            <option value="">All HSN Codes</option>
            {uniqueHsnCodes.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input
            type="date"
            id="dateFrom"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" // text-black added for consistency
          />
        </div>

        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input
            type="date"
            id="dateTo"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" // text-black added for consistency
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default FilterProducts;