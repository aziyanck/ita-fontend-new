import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import supabaseServices from './supabaseServices';

function ProductsBulk({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccessMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an Excel file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Define expected headers for validation and mapping
        const expectedHeaders = [
          'Date', 'Invoice No', 'Product Name', 'Distributor', 'HSN', 'Quantity', 'Amount'
        ];

        // Get actual headers from the uploaded file and normalize them (trim and remove special characters if any)
        const actualHeaders = Object.keys(json[0] || {}).map(header =>
          header.replace(/\s+/g, ' ').trim() // Replace multiple spaces with single, then trim
        );

        // Check if all expected headers are present in the uploaded file
        const missingHeaders = expectedHeaders.filter(header => !actualHeaders.includes(header));

        if (missingHeaders.length > 0) {
            setError(`Missing required headers in the Excel file: ${missingHeaders.join(', ')}. Please use the provided template.`);
            setLoading(false);
            return;
        }

        // Map your Excel columns to your Supabase table columns
        // This mapping now uses the expected headers directly, assuming they are present
        const formattedData = json.map(row => ({
          date: row.Date ? new Date(row.Date).toISOString().substr(0, 10) : new Date().toISOString().substr(0, 10),
          invoice_no: parseFloat(row['Invoice No']),
          product_name: row['Product Name'],
          distributor: row.Distributor,
          hsn: row.HSN,
          quantity: parseInt(row.Quantity),
          amount: parseFloat(row.Amount),
        }));

        // Basic validation before inserting
        const isValidData = formattedData.every(item =>
          item.date && item.invoice_no && item.product_name && item.distributor && item.hsn && !isNaN(item.quantity) && !isNaN(item.amount)
        );

        if (!isValidData) {
          setError('Invalid data in Excel file. Please check column headers and data types. Ensure all required fields are filled.');
          setLoading(false);
          return;
        }

        // Supabase bulk insert
        const { error: insertError } = await supabaseServices.addBulkPurchases(formattedData);

        if (insertError) {
          setError(`Failed to upload purchases: ${insertError.message}`);
          console.error('Bulk insert error:', insertError);
        } else {
          setSuccessMessage(`${formattedData.length} purchases uploaded successfully!`);
          onSuccess(); // Refresh the main list
          setTimeout(() => {
            onClose(); // Close the modal/form after a short delay
          }, 1500);
        }
      } catch (err) {
        setError(`Error processing file: ${err.message}. Please ensure it's a valid Excel file and matches the template format.`);
        console.error('File processing error:', err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = () => {
    const headers = ['Date', 'Invoice No', 'Product Name', 'Distributor', 'HSN', 'Quantity', 'Amount'];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bulk Purchases Template");
    XLSX.writeFile(wb, "bulk_purchases_template.xlsx");
  };

  return (
    <div className="p-4 text-gray-700 bg-blue-50 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Bulk Add Purchases from Excel</h3>
      <p className="text-sm text-gray-600">
        To ensure correct data upload, please download the template below, fill in your purchase details, and then upload the file.
      </p>

      {/* New button for downloading template */}
      <div className="flex justify-start">
        <button
          onClick={handleDownloadTemplate}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 text-sm font-semibold"
        >
          Download Template (Excel)
        </button>
      </div>

      <div>
        <label htmlFor="excel-upload" className="block text-sm font-medium text-gray-700 mb-2">Upload Your Filled Excel File:</label>
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {file && <p className="mt-2 text-sm text-gray-500">Selected file: {file.name}</p>}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

      <div className="flex gap-4">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Upload Purchases'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
      {/* Removed the old instruction text as template download button handles it */}
    </div>
  );
}

export default ProductsBulk;