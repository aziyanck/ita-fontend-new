import React, { useState, useEffect } from 'react';
import supabaseServices from './supabaseServices';
import ProductsBulk from './products_bulk'; // Assuming this component is still relevant for old data or other bulk ops
import * as XLSX from 'xlsx'; // Assuming you still need this for download logic

// Destructure the relevant functions.
const {
  addPurchaseMaster,
  getPurchaseMasters,
  addPurchaseItems,
  getPurchaseItemsByInvoice
} = supabaseServices;

// --- Helper component to display invoice details ---
const InvoiceDetails = ({ invoiceNo, onClose }) => {
  const [masterData, setMasterData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch master details from 'purchase_masters' (plural)
        const { data: masterInfo, error: masterError } = await supabaseServices.client
            .from('purchase_masters') // Correct table name
            .select('*')
            .eq('invoice_no', invoiceNo)
            .single();

        if (masterError) {
            throw new Error(`Error fetching master for ${invoiceNo}: ${masterError.message}`);
        }
        setMasterData(masterInfo);

        const itemsData = await getPurchaseItemsByInvoice(invoiceNo);
        setItems(itemsData);
      } catch (err) {
        console.error("Error fetching invoice details:", err);
        setError(err.message || "Failed to load invoice details.");
      } finally {
        setLoading(false);
      }
    };

    if (invoiceNo) {
      fetchInvoiceDetails();
    }
  }, [invoiceNo]);

  if (loading) return <div className="text-center p-4">Loading invoice details...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  if (!masterData) return <div className="text-center p-4">Invoice not found.</div>;

  return (
    <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md text-gray-800 space-y-4">
      <h3 className="text-2xl font-semibold mb-4">Invoice Details: {masterData.invoice_no}</h3>
      {/* Accessing 'date' column as per your database screenshot */}
      <p><strong>Date:</strong> {formatDate(masterData.date)}</p>
      <p><strong>Distributor:</strong> {masterData.distributor}</p>

      <h4 className="text-lg font-semibold mt-6 mb-2">Materials for this Invoice</h4>
      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border rounded text-sm">
            <thead className="bg-gray-100 text-gray-800 font-semibold border-b border-gray-300">
              <tr>
                <th className="px-3 py-2 text-left">Serial No</th>
                <th className="px-3 py-2 text-left">Product Name</th>
                <th className="px-3 py-2 text-left">HSN</th>
                <th className="px-3 py-2 text-left">Brand</th>
                <th className="px-3 py-2 text-left">Quantity</th>
                <th className="px-3 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t bg-white">
                  <td className="px-3 py-2">{item.serial_no || '-'}</td>
                  <td className="px-3 py-2">{item.product_name}</td>
                  <td className="px-3 py-2">{item.hsn || '-'}</td>
                  <td className="px-3 py-2">{item.brand || '-'}</td>
                  <td className="px-3 py-2">{item.quantity}</td> {/* Quantity is text in DB */}
                  <td className="px-3 py-2">{item.amount}</td> {/* Amount is float8 in DB */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No materials found for this invoice.</p>
      )}

      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Close</button>
      </div>
    </div>
  );
};


function SalesTable() {
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState(null);

  const fetchInvoices = async () => {
    try {
      // Use the getPurchaseMasters function, which selects 'date'
      const data = await getPurchaseMasters();
      if (data) setInvoices(data);
    } catch (err) {
      console.error("Fetch invoices error:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate || typeof isoDate !== 'string') return isoDate;
    // Check if it's already in DD/MM/YYYY format or a valid date
    if (isoDate.includes('/') && isoDate.split('/').length === 3) return isoDate;
    try {
      const dateObj = new Date(isoDate);
      if (isNaN(dateObj)) return isoDate; // Invalid date string
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      console.error("Error formatting date:", isoDate, e);
      return isoDate;
    }
  };


  const handleDownload = (format) => {
    if (invoices.length === 0) {
      alert("No data to download.");
      return;
    }
    alert("Download functionality needs to be updated to handle master/item data separately or by joining.");
   
  };

  const PurchaseForm = ({ onClose, onSuccess }) => {
    // Initial date state as YYYY-MM-DD for input type="date"
    const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
    const [invoiceNo, setInvoiceNo] = useState('');
    const [distributor, setDistributor] = useState('');
    const [materials, setMaterials] = useState([
      { serialNo: '', productName: '', hsn: '', brand: '', quantity: '', amount: '' }
    ]);

    const handleMaterialChange = (index, field, value) => {
      const updated = [...materials];
      updated[index][field] = value;
      setMaterials(updated);
    };

    const addMaterialRow = () => {
      setMaterials([...materials, {
        serialNo: '', productName: '', hsn: '', brand: '', quantity: '', amount: ''
      }]);
    };

    const removeMaterialRow = (index) => {
      const updated = materials.filter((_, i) => i !== index);
      setMaterials(updated);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!date || !invoiceNo || !distributor) {
        alert('Please fill Date, Invoice No and Distributor');
        return;
      }

      const validMaterials = materials.filter(
        (m) => m.productName && m.quantity !== '' && m.amount !== '' // Quantity can be '0' but not empty string
      );

      if (validMaterials.length === 0) {
        alert('Please add at least one valid material with Product Name, Quantity, and Amount.');
        return;
      }

      try {
        // Step 1: Insert into purchase_masters
        const masterDataToInsert = {
          date: date, // <--- IMPORTANT: Using 'date' as per DB schema
          invoice_no: invoiceNo,
          distributor: distributor
        };
        const insertedMaster = await addPurchaseMaster(masterDataToInsert);

        // Step 2: Prepare and insert into purchase_items
        const itemsDataToInsert = validMaterials.map((m) => ({
          invoice_no: invoiceNo, // Link using invoice_no
          serial_no: m.serialNo || null,
          product_name: m.productName,
          hsn: m.hsn || null,
          brand: m.brand || null,
          quantity: m.quantity, // <--- IMPORTANT: Quantity is TEXT in DB, send as string
          amount: parseFloat(m.amount) // Amount is float8, so parse it
        }));

        await addPurchaseItems(itemsDataToInsert);

        alert("Purchase saved successfully!");
        onSuccess(); // Re-fetch master invoices for dashboard update
        onClose();   // Close the form
      } catch (error) {
        // Handle specific errors (e.g., unique constraint violation for invoice_no)
        if (error.code === '23505') { // PostgreSQL unique violation error code
            alert(`Error: Invoice Number "${invoiceNo}" already exists. Please use a unique invoice number.`);
        } else {
            alert(`Failed to save purchase: ${error.message || error.details || 'Unknown error'}`);
        }
        console.error("Purchase submission error:", error);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white border border-gray-300 rounded-lg shadow-md text-gray-800">
        <h3 className="text-2xl font-semibold mb-4">Add Purchase</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-md focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="text-sm font-medium">Invoice No</label>
            <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-md focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="text-sm font-medium">Distributor</label>
            <input value={distributor} onChange={(e) => setDistributor(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-md focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mt-6 mb-2">Materials</h4>
          <div className="overflow-x-auto">
            <table className="w-full border rounded text-sm">
              <thead className="bg-gray-100 text-gray-800 font-semibold border-b border-gray-300">
                <tr>
                  <th className="px-3 py-2 text-left">Serial No</th>
                  <th className="px-3 py-2 text-left">Product Name</th>
                  <th className="px-3 py-2 text-left">HSN</th>
                  <th className="px-3 py-2 text-left">Brand</th>
                  <th className="px-3 py-2 text-left">Quantity</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((item, index) => (
                  <tr key={index} className="border-t bg-white">
                    <td className="px-3 py-2"><input value={item.serialNo} onChange={(e) => handleMaterialChange(index, 'serialNo', e.target.value)} className="w-full px-2 py-1 border border-gray-300 bg-gray-50 rounded" /></td>
                    <td className="px-3 py-2"><input value={item.productName} onChange={(e) => handleMaterialChange(index, 'productName', e.target.value)} className="w-full px-2 py-1 border border-gray-300 bg-gray-50 rounded" /></td>
                    <td className="px-3 py-2"><input value={item.hsn} onChange={(e) => handleMaterialChange(index, 'hsn', e.target.value)} className="w-full px-2 py-1 border border-gray-300 bg-gray-50 rounded" /></td>
                    <td className="px-3 py-2"><input value={item.brand} onChange={(e) => handleMaterialChange(index, 'brand', e.target.value)} className="w-full px-2 py-1 border border-gray-300 bg-gray-50 rounded" /></td>
                    {/* Quantity input remains type="number" for user, but we'll send as string */}
                    <td className="px-3 py-2"><input type="number" value={item.quantity} onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)} className="w-full px-2 py-1 border border-gray-300 bg-gray-50 rounded" /></td>
                    <td className="px-3 py-2"><input type="number" value={item.amount} onChange={(e) => handleMaterialChange(index, 'amount', e.target.value)} className="w-full px-2 py-1 border border-gray-300 bg-gray-50 rounded" /></td>
                    <td className="px-3 py-2"><button type="button" onClick={() => removeMaterialRow(index)} className="text-red-600 hover:underline">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={addMaterialRow} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Row</button>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Save Purchase</button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex justify-center items-center w-full max-w-screen">
      <div className="p-6 bg-white w-full max-w-screen h-full overflow-x-clip font-sans">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Purchase Management</h2>
          <div className="flex space-x-2">
            <button onClick={() => { setShowPurchaseForm(true); setShowBulkForm(false); setSelectedInvoiceNo(null); }} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">Add Purchase</button>
            <button onClick={() => { setShowBulkForm(true); setShowBulkForm(false); setSelectedInvoiceNo(null); }} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Add Bulk</button>
            <button onClick={() => handleDownload('xlsx')} className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm">Download Excel</button>
            <button onClick={() => handleDownload('csv')} className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 text-sm">Download CSV</button>
          </div>
        </div>

        {/* Conditional rendering of forms/details */}
        {showPurchaseForm && <PurchaseForm onClose={() => setShowPurchaseForm(false)} onSuccess={fetchInvoices} />}
        {showBulkForm && <ProductsBulk onClose={() => setShowBulkForm(false)} onSuccess={fetchInvoices} />}
        {selectedInvoiceNo && <InvoiceDetails invoiceNo={selectedInvoiceNo} onClose={() => setSelectedInvoiceNo(null)} />}

        {/* Only show the invoice list if no form/details are open */}
        {!showPurchaseForm && !showBulkForm && !selectedInvoiceNo && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Purchases</h3>
              {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr>
                        {/* Headers to match purchase_masters columns */}
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Invoice No</th>
                        <th className="px-4 py-2 text-left">Distributor</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.invoice_no} className="border-b border-gray-200 hover:bg-gray-50">
                          {/* Accessing 'date' column as per your database screenshot */}
                          <td className="px-4 py-2">{formatDate(invoice.date)}</td>
                          <td className="px-4 py-2">{invoice.invoice_no}</td>
                          <td className="px-4 py-2">{invoice.distributor}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => setSelectedInvoiceNo(invoice.invoice_no)}
                              className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
                            >
                              Show Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-4 text-gray-600">No purchases found. Add a new purchase to get started!</p>
              )}
            </div>
        )}
      </div>
    </div>
  );
}

export default SalesTable;