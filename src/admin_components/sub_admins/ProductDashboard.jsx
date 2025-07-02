import React, { useState, useEffect, useMemo } from 'react';
import { getAllComponents, getPurchasesSummary } from '../supabaseServices';
import InvoiceDetail from './InvoiceDetail';
import ComponentsTable from './ComponentsTable';

const ProductDashboard = ({ onTabChange, onViewModeChange, viewMode, searchQuery, dateRange }) => {

  const [activeTab, setActiveTab] = useState('components');
  const [tableData, setTableData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'components') {
          const data = await getAllComponents();
          setTableData(data);
        } else if (activeTab === 'purchase') {
          const data = await getPurchasesSummary();
          setTableData(data);
        } else if (activeTab === 'sell') {
          setTableData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTableData([]);
      }
    };
    fetchData();
  }, [activeTab]);

  const filteredData = useMemo(() => {
    if (!searchQuery && (!dateRange.from || !dateRange.to)) return tableData;

    let filtered = tableData;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        if (activeTab === 'components') {
          let searchField = '';
          if (viewMode === 'category') {
            searchField = (item.category?.name || '').toLowerCase();
          } else {
            searchField = (item.name || '').toLowerCase();
          }
          return searchField.includes(query);
        }
        if (activeTab === 'purchase' || activeTab === 'sell') {
          return (item.invoice_no || '').toLowerCase().includes(query);
        }
        return false;
      });
    }


    if ((activeTab === 'purchase' || activeTab === 'sell') && dateRange.from && dateRange.to) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    return filtered;
  }, [tableData, searchQuery, dateRange, activeTab, onViewModeChange]);

  return (
    <div className="bg-gray-200 p-4 max-w-screen md:w-full h-auto text-gray-600 mx-auto rounded-lg shadow-md">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => handleTabSwitch('components')}
          className={`px-4 py-2 rounded ${activeTab === 'components' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
        >
          Components
        </button>
        <button
          onClick={() => handleTabSwitch('purchase')}
          className={`px-4 py-2 rounded ${activeTab === 'purchase' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
        >
          Purchase
        </button>
        <button
          onClick={() => handleTabSwitch('sell')}
          className={`px-4 py-2 rounded ${activeTab === 'sell' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
        >
          Sell
        </button>
      </div>

      <div className="border border-gray-300 rounded-md overflow-x-scroll bg-green-100 p-4 min-h-[200px]">
        {activeTab === 'components' && (
          <ComponentsTable data={filteredData} onViewModeChange={onViewModeChange} />
        )}

        {activeTab === 'purchase' && (
          <PurchasesTable data={filteredData} setSelectedInvoice={setSelectedInvoice} />
        )}
        {activeTab === 'sell' && (
          <div className="text-gray-500 text-center py-8">
            Sell functionality coming soon...
          </div>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceDetail
          invoiceNo={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

const PurchasesTable = ({ data, setSelectedInvoice }) => (
  <div>
    <table className="min-w-full text-left">
      <thead>
        <tr className="border-b bg-gray-100">
          <th className="px-4 py-2">Sl No.</th>
          <th className="px-4 py-2">Invoice No.</th>
          <th className="px-4 py-2">Total Amount</th>
          <th className="px-4 py-2">Dealer</th>
          <th className="px-4 py-2">Purchase Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((purchase, index) => (
          <tr key={`${purchase.invoice_no}-${index}`} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2">{index + 1}</td>
            <td
              className="px-4 py-2 text-blue-600 cursor-pointer"
              onClick={() => setSelectedInvoice(purchase.invoice_no)}
            >
              {purchase.invoice_no}
            </td>
            <td className="px-4 py-2">₹ {(purchase.total ?? 0).toFixed(2)}</td>
            <td className="px-4 py-2">
              {typeof purchase.dealer === 'object'
                ? purchase.dealer?.name || 'N/A'
                : purchase.dealer || 'N/A'}
            </td>
            <td className="px-4 py-2">
              {purchase.date ? new Date(purchase.date).toLocaleDateString() : 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductDashboard;
