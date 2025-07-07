import React, { useEffect, useState, useMemo } from 'react';
import { getInvoiceDetails } from '../supabaseServices'; // Only one import needed

const InvoiceDetail = ({ invoiceNo, onClose }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getInvoiceDetails(invoiceNo);
        setInvoiceData(data);
      } catch (error) {
        // This will now catch errors if the foreign key on the components table is wrong
        console.error('Error fetching invoice details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (invoiceNo) {
      fetchDetail();
    }
  }, [invoiceNo]);

  const finalAmount = useMemo(() => {
    return invoiceData?.total_amount || 0;
  }, [invoiceData]);

  // Memoized calculation for the total amount
  const totalProductAmount = useMemo(() => {
    if (!invoiceData?.purchase_items) return 0;
    return invoiceData.purchase_items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [invoiceData]);

  // Memoized calculation to get a unique list of dealers
  const dealerNames = useMemo(() => {
    if (!invoiceData?.purchase_items) return 'N/A';

    // Create a set of all dealer names to ensure uniqueness

    const dealers = new Set(
      invoiceData.purchase_items
        .map(item => item.component?.dealer?.name)
        .filter(Boolean) // Filter out any null or undefined names
    );

    if (dealers.size === 0) return 'N/A';
    // Join the unique names into a comma-separated string
    return [...dealers].join(', ');
  }, [invoiceData]);


 // Remove dealerNames memo completely
// and replace its usage in JSX with invoiceData.dealer?.name directly

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
        Invoice Details: {invoiceNo}
      </h2>

      {loading ? (
        <p>Loading invoice details...</p>
      ) : invoiceData ? (
        <div className="space-y-6">
          {/* Invoice Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-lg border">
            <div>
              <strong className="block text-gray-500 font-medium">Dealer</strong>
              <span className="text-gray-800 text-base">{invoiceData.dealer?.name || 'N/A'}</span>
            </div>
            <div>
              <strong className="block text-gray-500 font-medium">Invoice Date</strong>
              <span className="text-gray-800 text-base">{new Date(invoiceData.date).toLocaleDateString()}</span>
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
                  {invoiceData.purchase_items.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{item.component.name}</td>
                      <td className="px-4 py-2">{item.component.hsn}</td>
                      <td className="px-4 py-2">{item.component.brand}</td>
                      <td className="px-4 py-2 text-right">{item.qty}</td>
                      <td className="px-4 py-2 text-right">₹ {item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p>No data found for this invoice.</p>
      )}
    </div>
  </div>
);

};

export default InvoiceDetail;