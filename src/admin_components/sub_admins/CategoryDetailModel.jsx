import React from "react";

const CategoryDetailModal = ({ categoryName, products, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Products in "{categoryName}"
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold text-xl"
          >
            ×
          </button>
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
                <td className={`px-4 py-2 ${prod.qty === 0 ? 'text-red-600' : ''}`}>{prod.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryDetailModal;
