import React, { useState, useMemo } from "react";

const ComponentsTable = ({ data, onViewModeChange }) => {
  const [byCategory, setByCategory] = useState(false);

  const handleToggle = () => {
    setByCategory(prev => {
      const newMode = !prev ? 'category' : 'product';
      if (onViewModeChange) onViewModeChange(newMode);
      return !prev;
    });
  };

  const groupedData = useMemo(() => {
    if (!byCategory) return [];
    const map = {};
    data.forEach(comp => {
      const categoryName = comp.category?.name || "Uncategorized";
      if (!map[categoryName]) {
        map[categoryName] = { category: categoryName, totalQty: 0 };
      }
      map[categoryName].totalQty += comp.qty;
    });
    return Object.values(map);
  }, [data, byCategory]);

  return (
    <div className="flex flex-col justify-center items-start gap-5 w-full">
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white"
        onClick={handleToggle}
      >
        {byCategory ? "By Product" : "By Category"}
      </button>

      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="px-4 py-2">Sl No.</th>
            {byCategory ? (
              <>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Total Qty</th>
              </>
            ) : (
              <>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">HSN</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Brand</th>
                <th className="px-4 py-2">Category</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {byCategory ? (
            groupedData.map((item, index) => (
              <tr key={`${item.category}-${index}`} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.totalQty}</td>
              </tr>
            ))
          ) : (
            data.map((comp, index) => (
              <tr key={`${comp.id}-${index}`} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{comp.name}</td>
                <td className="px-4 py-2">{comp.hsn}</td>
                <td className="px-4 py-2">{comp.qty}</td>
                <td className="px-4 py-2">{comp.brand}</td>
                <td className="px-4 py-2">{comp.category?.name || 'Uncategorized'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComponentsTable;
