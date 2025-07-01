import React, { useState, useEffect } from 'react';
import { getAllComponents, getPurchasesSummary } from '../supabaseServices';
import InvoiceDetail from './InvoiceDetail';


const ProductDashboard = () => {
  const [activeTab, setActiveTab] = useState('components'); // components | purchase | sell
  const [tableData, setTableData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);


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
          setTableData([]); // placeholder since sell isn't implemented
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTableData([]);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="bg-gray-200 p-4 max-w-screen md:w-full h-auto text-gray-600 mx-auto rounded-lg shadow-md">
      {/* Tab Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('components')}
          className={`px-4 py-2 rounded ${activeTab === 'components' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
            }`}
        >
          Components
        </button>
        <button
          onClick={() => setActiveTab('purchase')}
          className={`px-4 py-2 rounded ${activeTab === 'purchase' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
            }`}
        >
          Purchase
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`px-4 py-2 rounded ${activeTab === 'sell' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
            }`}
        >
          Sell
        </button>
      </div>

      {/* Table Container */}
      <div className="border border-gray-300 rounded-md overflow-x-scroll bg-white p-4 min-h-[200px]">
        {activeTab === 'components' && <ComponentsTable data={tableData} />}
        {activeTab === 'purchase' && <PurchasesTable data={tableData} setSelectedInvoice={setSelectedInvoice} />
}
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

/* Components Table */
const ComponentsTable = ({ data }) => (
  <table className="min-w-full text-left">
    <thead>
      <tr className="border-b bg-gray-100">
        <th className="px-4 py-2">Sl No.</th>
        <th className="px-4 py-2">Name</th>
        <th className="px-4 py-2">HSN</th>
        <th className="px-4 py-2">Qty</th>
        <th className="px-4 py-2">Brand</th>
        <th className="px-4 py-2">Dealer Name</th>
      </tr>
    </thead>
    <tbody>
      {data.map((comp, index) => (
        <tr key={comp.id} className="border-b hover:bg-gray-50">
          <td className="px-4 py-2">{index + 1}</td>
          <td className="px-4 py-2">{comp.name}</td>
          <td className="px-4 py-2">{comp.hsn}</td>
          <td className="px-4 py-2">{comp.qty}</td>
          <td className="px-4 py-2">{comp.brand}</td>
          <td className="px-4 py-2">{comp.dealer?.name || 'N/A'}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/* Purchases Table */
const PurchasesTable = ({ data, setSelectedInvoice }) => (
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
        <tr key={purchase.invoice_no} className="border-b hover:bg-gray-50">
          <td className="px-4 py-2">{index + 1}</td>
          <td
            className="px-4 py-2 text-blue-600 underline cursor-pointer"
            onClick={() => setSelectedInvoice(purchase.invoice_no)}
          >
            {purchase.invoice_no}
          </td>
          <td className="px-4 py-2">₹ {(purchase.total ?? 0).toFixed(2)}</td>
          <td className="px-4 py-2">{purchase.dealer}</td>
          <td className="px-4 py-2">
            {purchase.date ? new Date(purchase.date).toLocaleDateString() : 'N/A'}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ProductDashboard;
