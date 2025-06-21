import React, { useState, useEffect } from 'react';
import getAll from './supabase';

const SalesTable = () => {
    const [sales, setSales] = useState([]);
    let counter = 1;
    useEffect(() => {
        const fetchData = async () => {
            const initialSalesData = await getAll();
            if (initialSalesData) {
                setSales(initialSalesData);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto font-sans">
            <div className="flex justify-between">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Products</h2>
                <button className='mb-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200'>Add Product</button>

            </div>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">#</th>
                            <th className="py-3 px-6 text-left">Product</th>
                            <th className="py-3 px-6 text-center">HSN</th>
                            <th className="py-3 px-6 text-center">QTY</th>
                            <th className="py-3 px-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {sales.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left">{counter++}</td>
                                <td className="py-3 px-6 text-left">{item.item}</td>
                                <td className="py-3 px-6 text-center">{item.hsn}</td>
                                <td className="py-3 px-6 text-center">{item.in_stock}</td>
                                <td className="py-3 px-6 text-center">{item.hsn}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesTable;
