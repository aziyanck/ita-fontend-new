import React, { useState, useEffect } from 'react';
import supabaseService from './supabase';

const getAll = supabaseService.getAll;
const addProduct = supabaseService.addProduct;

function AddForm({ onClose, onSuccess }) {
    const [item, setItem] = useState('');
    const [hsn, setHsn] = useState('');
    const [qty, setQty] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!item || !hsn) return alert("Please fill all fields");

        await addProduct(item, hsn, parseInt(qty));
        onSuccess();  // refetch and close form
        onClose();    // hide the form
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 text-gray-700 bg-gray-50 rounded-lg shadow-md">
            <div>
                <label htmlFor="item" className="block text-sm font-medium text-gray-700">Item Name</label>
                <input type="text" id="item" value={item} onChange={(e) => setItem(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
                <label htmlFor="hsn" className="block text-sm font-medium text-gray-700">HSN</label>
                <input type="text" id="hsn" value={hsn} onChange={(e) => setHsn(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
                <label htmlFor="qty" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" id="qty" value={qty} onChange={(e) => setQty(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex gap-4">
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Add</button>
                <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400">Cancel</button>
            </div>
        </form>
    );
}

const SalesTable = () => {
    const [products, setProducts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchProducts = async () => {
        const initialSalesData = await getAll();
        if (initialSalesData) setProducts(initialSalesData);

    };

    useEffect(() => {
        fetchProducts();
        console.log("in", products)
    }, []);

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg max-w-screen overflow-x-clip font-sans">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Products</h2>
                <button
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setShowAddForm(true)}
                >
                    Add Product
                </button>
            </div>

            {showAddForm && (
                <AddForm
                    onClose={() => setShowAddForm(false)}
                    onSuccess={fetchProducts}
                />
            )}

            <div className="overflow-x-auto mt-6">
                {products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No products available. Please add some products.
                    </div>
                )}
                <table className="w-full table-auto border-collapse">
                    <thead className={`${products.length === 0 ? 'hidden' : ''}`}>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">#</th>
                            <th className="py-3 px-6 text-left">Product</th>
                            <th className="py-3 px-6 text-center">HSN</th>
                            <th className="py-3 px-6 text-center">QTY</th>
                            <th className="py-3 px-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">

                        {products.map((item, index) => {


                            return (
                                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left">{index + 1}</td>
                                    <td className="py-3 px-6 text-left">{item.item}</td>
                                    <td className="py-3 px-6 text-center">{item.hsn}</td>
                                    <td className="py-3 px-6 text-center">{item.in_stock}</td>
                                    <td className="py-3 px-6 text-center">—</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesTable;
