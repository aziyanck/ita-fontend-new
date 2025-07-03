import React, { useEffect, useState, useMemo } from 'react';
import { getSalesInvoiceDetails } from '../supabaseServices';

const SalesInvoiceDetail = ({ invoiceNo, onClose }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getSalesInvoiceDetails(invoiceNo); // Use the new sales-specific API
        setInvoiceData(data);
      } catch (error) {
        console.error('Error fetching sales invoice details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (invoiceNo) {
      fetchDetail();
    }
  }, [invoiceNo]);

  const finalAmount = useMemo(() => invoiceData?.total_amount || 0, [invoiceData]);

  const totalProductAmount = useMemo(() => {
    if (!invoiceData?.sell_items) return 0;
    return invoiceData.sell_items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [invoiceData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto text-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-200 rounded-full"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Sales Invoice Details: {invoiceNo}
        </h2>

        {loading ? (
          <p>Loading sales invoice details...</p>
        ) : invoiceData ? (
          <div className="space-y-6">
            {/* Invoice Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-lg border">
              <div>
                <strong className="block text-gray-500 font-medium">Customer</strong>
                <span className="text-gray-800 text-base">{invoiceData.customer || 'N/A'}</span>
              </div>
              <div>
                <strong className="block text-gray-500 font-medium">Invoice Date</strong>
                <span className="text-gray-800 text-base">
                  {invoiceData.date ? new Date(invoiceData.date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div>
                <strong className="block text-gray-500 font-medium">Total Products Amount</strong>
                <span className="text-gray-800 text-base font-semibold">
                  ₹ {totalProductAmount.toFixed(2)}
                </span>
              </div>
              <div>
                <strong className="block text-gray-500 font-medium">Final Amount (with GST)</strong>
                <span className="text-gray-800 text-base font-semibold">
                  ₹ {finalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Items</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100">
                    <tr className="border-b">
                      <th className="px-4 py-2 font-medium">Name</th>
                      <th className="px-4 py-2 font-medium">HSN</th>
                      <th className="px-4 py-2 font-medium">Brand</th>
                      <th className="px-4 py-2 font-medium text-right">Qty</th>
                      <th className="px-4 py-2 font-medium text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoiceData.sell_items || []).map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{item.component?.name || 'N/A'}</td>
                        <td className="px-4 py-2">{item.component?.hsn || 'N/A'}</td>
                        <td className="px-4 py-2">{item.component?.brand || 'N/A'}</td>
                        <td className="px-4 py-2 text-right">{item.qty}</td>
                        <td className="px-4 py-2 text-right">₹ {item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Get PDF Button */}
            <div className="flex justify-end pt-4">
              {invoiceData.url ? (
                <a
                  href={invoiceData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  📝 Get PDF
                </a>
              ) : (
                <span className="text-gray-500 italic">PDF not available</span>
              )}
            </div>
          </div>
        ) : (
          <p>No data found for this sales invoice.</p>
        )}
      </div>
    </div>
  );
};

export default SalesInvoiceDetail;
