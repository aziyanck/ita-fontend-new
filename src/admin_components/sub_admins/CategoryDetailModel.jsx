import React, { useMemo } from "react";

const CategoryDetailModal = ({ categoryName, products, onClose }) => {
  // Calculate total quantity for the category
  const totalQty = useMemo(
    () => products.reduce((sum, prod) => sum + (prod.qty || 0), 0),
    [products]
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              Products in "{categoryName}"
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Total Qty:{" "}
              <span className="font-bold text-gray-800">{totalQty}</span>
            </p>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-700 font-bold text-3xl hover:cursor-pointer mt-2"
            >
              ×
            </button>
          </div>
        </div>
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2">Sl No.</th>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">HSN</th>
              <th className="px-4 py-2">Stock Qty</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, index) => (
              <tr key={`${prod.id}-${index}`} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{prod.name}</td>
                <td className="px-4 py-2">{prod.hsn}</td>
                <td className="px-4 py-2">{prod.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryDetailModal;
