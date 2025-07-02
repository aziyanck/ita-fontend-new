import React, { useState, useMemo } from "react";

const ComponentsTable = ({ data }) => {
    const [byHSN, setByHSN] = useState(false);

    const groupedData = useMemo(() => {
        if (!byHSN) return [];
        const map = {};
        data.forEach(comp => {
            if (!map[comp.hsn]) {
                map[comp.hsn] = { hsn: comp.hsn, totalQty: 0 };
            }
            map[comp.hsn].totalQty += comp.qty;
        });
        return Object.values(map);
    }, [data, byHSN]);

    return (
        <div className="flex  flex-col justify-center items-start  gap-5  w-full">
            <button
                className="px-4  py-2 rounded bg-blue-600 text-white"
                onClick={() => setByHSN(prev => !prev)}
            >
                {byHSN ? "By Product" : "By HSN"}
            </button>

            <table className="min-w-full text-left">
                <thead>
                    <tr className="border-b bg-gray-100">
                        <th className="px-4 py-2">Sl No.</th>
                        {byHSN ? (
                            <>
                                <th className="px-4 py-2">HSN</th>
                                <th className="px-4 py-2">Total Qty</th>
                            </>
                        ) : (
                            <>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">HSN</th>
                                <th className="px-4 py-2">Qty</th>
                                <th className="px-4 py-2">Brand</th>
                                <th className="px-4 py-2">Dealer Name</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {byHSN ? (
                        groupedData.map((item, index) => (
                            <tr key={`${item.hsn}-${index}`} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{item.hsn}</td>
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
                                <td className="px-4 py-2">{comp.dealer?.name || 'N/A'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ComponentsTable;
