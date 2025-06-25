import React, { useState, useEffect, useCallback } from 'react';
import supabaseServices from './supabaseServices';
import ProductsBulk from './products_bulk';
import FilterProducts from './filterproducts'; // Ensure the path is correct if your file is named 'filterproducts.jsx'
import * as XLSX from 'xlsx'; // For Excel export

const { getAll, addPurchase, updatePurchase, deletePurchase } = supabaseServices;

function SalesTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // New state for filtered products
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [editPurchase, setEditPurchase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Removed the extra 'CONST' here which was causing a syntax error

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const initialSalesData = await getAll();
      if (initialSalesData) {
        setProducts(initialSalesData);
        setFilteredProducts(initialSalesData); // Initially, all products are filtered
      }
    } catch (err) {
      setError('Failed to fetch purchases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Callback to receive filtered data from FilterProducts component
  const handleFilteredData = useCallback((data) => {
    setFilteredProducts(data);
  }, []);

  const handleEdit = (item) => {
    setEditPurchase(item);
    setShowPurchaseForm(true);
    setShowBulkForm(false);
  };

  const handleDelete = async (id) => {
    if (!id || typeof id !== 'string' || id.length < 10) {
      alert("Invalid ID. Cannot delete.");
      console.warn("Blocked delete: invalid ID →", id);
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this purchase?');
    if (!confirmed) return;

    setLoading(true);
    setError('');

    try {
      console.log('Attempting to delete ID:', id);
      const result = await deletePurchase(id);
      const isDeleteSuccessful = result !== null;
      if (isDeleteSuccessful) {
        setError('');
        setTimeout(() => {
          fetchProducts();
        }, 500);
      } else {
        setError('Failed to delete purchase');
      }
    } catch (err) {
      setError('Error deleting purchase');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const PurchaseForm = ({ onClose, onSuccess, purchase }) => {
    const [date, setDate] = useState(purchase ? purchase.date : new Date().toISOString().substr(0, 10));
    const [invoiceNo, setInvoiceNo] = useState(purchase ? purchase.invoice_no : '');
    const [productName, setProductName] = useState(purchase ? purchase.product_name : '');
    const [distributor, setDistributor] = useState(purchase ? purchase.distributor : '');
    const [hsn, setHsn] = useState(purchase ? purchase.hsn : '');
    const [quantity, setQuantity] = useState(purchase ? purchase.quantity : '');
    const [amount, setAmount] = useState(purchase ? purchase.amount : '');

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!productName || !distributor || !quantity || !amount || !invoiceNo || !hsn) {
        alert("Please fill all fields");
        return;
      }

      const newPurchase = {
        date,
        invoice_no: parseFloat(invoiceNo),
        product_name: productName,
        distributor,
        hsn,
        quantity: parseInt(quantity),
        amount: parseFloat(amount),
      };

      const result = purchase
        ? await updatePurchase(purchase.id, newPurchase)
        : await addPurchase(newPurchase);

      if (result) {
        onSuccess();
        onClose();
      } else {
        alert("Failed to save purchase");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 p-6 text-gray-700 bg-green-50 rounded-lg shadow-xl">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          {purchase ? 'Edit Purchase' : 'Add New Purchase'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="invoiceNo" className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
            <input
              id="invoiceNo"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="Invoice No"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="distributor" className="block text-sm font-medium text-gray-700 mb-1">Distributor</label>
            <input
              id="distributor"
              value={distributor}
              onChange={(e) => setDistributor(e.target.value)}
              placeholder="Distributor"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="hsn" className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
            <input
              id="hsn"
              value={hsn}
              onChange={(e) => setHsn(e.target.value)}
              placeholder="HSN Code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              placeholder="Quantity"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="Amount"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-5 rounded-md hover:bg-gray-400 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-5 rounded-md hover:bg-green-700 transition duration-150 ease-in-out"
          >
            {purchase ? 'Update Purchase' : 'Add Purchase'}
          </button>
        </div>
      </form>
    );
  };

  // Function to handle Excel/CSV download of filtered data
  const handleDownload = (format) => {
    if (filteredProducts.length === 0) {
      alert("No data to download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchases");

    let fileName = `filtered_purchases.${format}`;
    let fileType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8;';

    if (format === 'csv') {
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csvData], { type: fileType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else { // xlsx
      XLSX.writeFile(workbook, fileName);
    }
  };

  return (
    <div className="flex justify-center items-center w-full max-w-screen">
      <div className="p-6 bg-white w-full max-w-screen h-full overflow-x-clip font-sans">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Purchase List</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => { setEditPurchase(null); setShowPurchaseForm(true); setShowBulkForm(false); }}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Add Purchase
            </button>
            <button
              onClick={() => { setShowBulkForm(true); setShowPurchaseForm(false); setEditPurchase(null); }}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Add Bulk
            </button>
          </div>
        </div>

        {/* Filter Component and Download Buttons within a flex container for alignment */}
        {!showPurchaseForm && !showBulkForm && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Filter Purchases</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload('xlsx')}
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm"
                >
                  Download Excel
                </button>
                <button
                  onClick={() => handleDownload('csv')}
                  className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 text-sm"
                >
                  Download CSV
                </button>
              </div>
            </div>
            <FilterProducts products={products} onFilter={handleFilteredData} />
            {/* The Clear Filters button is already inside FilterProducts component */}
          </div>
        )}

        {showPurchaseForm && (
          <PurchaseForm
            onClose={() => { setShowPurchaseForm(false); setEditPurchase(null); }}
            onSuccess={fetchProducts}
            purchase={editPurchase}
          />
        )}

        {showBulkForm && (
          <ProductsBulk
            onClose={() => setShowBulkForm(false)}
            onSuccess={fetchProducts}
          />
        )}

        {/* Removed the old download buttons div */}
        {/* <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={() => handleDownload('xlsx')}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Download Excel
          </button>
          <button
            onClick={() => handleDownload('csv')}
            className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
          >
            Download CSV
          </button>
        </div> */}

        <div className="overflow-x-auto mt-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredProducts.length === 0 ? ( // Display filtered products
            <div className="text-center py-8 text-gray-500">No purchases available based on current filters.</div>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <th className="py-3 px-6 text-left">#</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Invoice No</th>
                  <th className="py-3 px-6 text-left">Product</th>
                  <th className="py-3 px-6 text-left">Distributor</th>
                  <th className="py-3 px-6 text-left">HSN</th>
                  <th className="py-3 px-6 text-center">QTY</th>
                  <th className="py-3 px-6 text-center">Amount</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredProducts.map((item, index) => ( // Use filteredProducts here
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{item.date}</td>
                    <td className="py-3 px-6">{item.invoice_no}</td>
                    <td className="py-3 px-6">{item.product_name}</td>
                    <td className="py-3 px-6">{item.distributor}</td>
                    <td className="py-3 px-6">{item.hsn}</td>
                    <td className="py-3 px-6 text-center">{item.quantity}</td>
                    <td className="py-3 px-6 text-center">{item.amount}</td>
                    <td className="py-3 px-6 text-center">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline ml-2">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesTable;