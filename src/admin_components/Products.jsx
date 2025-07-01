import React, { useState } from 'react';
import AddPurchase from './sub_admins/AddPurchase'; // Make sure the path is correct!

const ProductComponent = () => {
  const [showAddPurchase, setShowAddPurchase] = useState(false);

  const handleAddPurchaseClick = () => {
    setShowAddPurchase(true);
  };

  const handleCloseAddPurchase = () => {
    setShowAddPurchase(false);
  };

  return (
    <div className="bg-gray-200 p-4 w-full mx-auto">

      <div className="flex justify-end items-center mb-4">
        <button
          onClick={handleAddPurchaseClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          Add Purchase
        </button>
      </div>

      <div className="flex justify-end items-center mb-4">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center">
          Filter
        </button>
      </div>

      <div className="border border-gray-300 rounded-md h-96 bg-gray-50 p-4">
        <p className="text-gray-500">table here</p>
      </div>

      {showAddPurchase && (
        <AddPurchase onClose={handleCloseAddPurchase} />
      )}
    </div>
  );
};

export default ProductComponent;
