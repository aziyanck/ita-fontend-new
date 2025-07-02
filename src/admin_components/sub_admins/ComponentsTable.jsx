import React, { useState, useMemo } from "react";

const ComponentsTable = ({ data }) => {
    const [byCategory, setByCategory] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    const filteredComponents = selectedCategory
        ? data.filter(comp => (comp.category?.name || "Uncategorized") === selectedCategory)
        : [];

    return (
        <div className="flex flex-col justify-center items-start gap-5 w-full relative">
            <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={() => setByCategory(prev => !prev)}
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
                            <tr
                                key={`${item.category}-${index}`}
                                className="border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedCategory(item.category)}
                            >
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2 text-blue-600 hover:underline">{item.category}</td>
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

            {selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:bg-gray-200 rounded-full p-2 transition"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-4">
                            Products in {selectedCategory}
                        </h2>
                        {filteredComponents.length > 0 ? (
                            <ul className="space-y-2 max-h-80 overflow-y-auto">
                                {filteredComponents.map((comp, index) => (
                                    <li key={comp.id} className="p-3 border rounded-md">
                                        <p className="font-semibold">{comp.name}</p>
                                        <p className="text-sm text-gray-600">HSN: {comp.hsn} | <span className="font-semibold text-gray-900"> Qty: {comp.qty}</span> | Brand: {comp.brand}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No products found under this category.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComponentsTable;
