import React, { useState, useEffect, useRef } from 'react';
import {
  insertInvoice,
  insertComponent,
  insertPurchaseItem,
  getComponentDetails,
  updateComponentQty,
  getDealerByName,
  insertDealer,
} from '../supabaseServices';
import { supabase } from '../supabaseClient';

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronUpDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
  </svg>
);

const Combobox = ({ options, value, onChange, placeholder }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredOptions = query === ''
    ? options
    : options.filter(option =>
      option.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
    );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    if (!isOpen) setIsOpen(true);
  };

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Escape') setIsOpen(false); }}
          placeholder={placeholder}
          required
          className="w-full p-2 pr-10 border rounded-md bg-white"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
        >
          <ChevronUpDownIcon />
        </button>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">
              {query ? "No match found. You can add it as a new item." : "Type to search..."}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const AddPurchase = ({ onClose }) => {
  const [productOptions, setProductOptions] = useState([]);
  const [dealerOptions, setDealerOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [invoiceInfo, setInvoiceInfo] = useState({
    date: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    dealer: '',
  });
  const [items, setItems] = useState([{ id: 1, name: '', hsn: '', qty: 1, price: '', brand: '', category: '' }]);
  const [nextId, setNextId] = useState(2);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: comps, error: compErr } = await supabase.from('components').select('*');
        if (compErr) throw compErr;
        setProductOptions(comps);
      } catch (e) {
        console.error("Error fetching components:", e);
      }
    };

    const fetchDealers = async () => {
      try {
        const { data: dealers, error: dealerErr } = await supabase.from('dealers').select('*');
        if (dealerErr) throw dealerErr;
        setDealerOptions(dealers.map(d => d.name));
      } catch (e) {
        console.error("Error fetching dealers:", e);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data: categories, error } = await supabase.from('category').select('*');
        if (error) throw error;
        setCategoryOptions(categories);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };

    fetchProducts();
    fetchDealers();
    fetchCategories();
  }, []);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInvoiceInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, fieldName, value) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [fieldName]: value } : item));

    if (fieldName === 'name') {
      const existingComp = productOptions.find(p => p.name === value);
      if (existingComp) {
        setItems(prev => prev.map(item => item.id === id
          ? {
            ...item,
            hsn: existingComp.hsn,
            brand: existingComp.brand,
            category: existingComp.category_id
              ? categoryOptions.find(c => c.id === existingComp.category_id)?.name || ''
              : ''
          }
          : item
        ));
      } else {
        setItems(prev => prev.map(item => item.id === id
          ? { ...item, hsn: '', brand: '', category: '' }
          : item
        ));
      }
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: nextId, name: '', hsn: '', qty: 1, price: '', brand: '', category: '' }]);
    setNextId(prev => prev + 1);
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) {
      console.warn("You must have at least one item.");
      return;
    }
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Resolve dealer
      let dealerRecord = await getDealerByName(invoiceInfo.dealer);
      if (!dealerRecord) {
        dealerRecord = await insertDealer(invoiceInfo.dealer);
        console.log("New dealer inserted:", dealerRecord);
      } else {
        console.log("Using existing dealer:", dealerRecord);
      }
      const dealerId = dealerRecord.id;

      // 🚨 Calculate total amount
      const totalAmount = items.reduce((sum, item) =>
        sum + (parseFloat(item.qty) * parseFloat(item.price)), 0);

      const gstRate = 0.18; // 18% GST
      const totalWithGST = totalAmount + (totalAmount * gstRate);

      // Insert invoice with total_amount (including GST)
      const invoiceData = {
        date: invoiceInfo.date,
        invoice_no: invoiceInfo.invoiceNo,
        invoice_type: "purchase",
        url: "",
        total_amount: totalWithGST,
        dealer_id: dealerId,    // ✅ link dealer directly to invoice
      };

      const invoice = await insertInvoice(invoiceData);
      console.log("Invoice inserted with GST:", invoice);

      const componentIds = [];

      for (const item of items) {
        const existingComp = productOptions.find(p =>
          p.name === item.name &&
          p.brand === item.brand
        );

        let componentId;

        if (existingComp) {
          const currentComponent = await getComponentDetails(existingComp.id);
          const updatedQty = (currentComponent.qty || 0) + parseInt(item.qty);
          const updatedComponent = await updateComponentQty(existingComp.id, updatedQty);
          console.log("Component updated:", updatedComponent);
          componentId = existingComp.id;
        } else {
          const selectedCategory = categoryOptions.find(c => c.name === item.category);
          const componentData = {
            name: item.name,
            hsn: item.hsn,
            brand: item.brand,
            description: "",
            qty: parseInt(item.qty),
            dealer_id: dealerId,
            category_id: selectedCategory ? selectedCategory.id : null,
          };
          const newComponent = await insertComponent(componentData);
          console.log("New component inserted:", newComponent);
          componentId = newComponent.id;
        }

        componentIds.push(componentId);
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const purchaseData = {
          comp_id: componentIds[i],
          qty: parseInt(item.qty),
          price: parseFloat(item.price),
          invoice_no: invoice.invoice_no,
          date: invoiceInfo.date,
        };
        const purchaseItem = await insertPurchaseItem(purchaseData);
        console.log("Purchase item inserted:", purchaseItem);
      }

      alert("Purchase invoice, components, and items successfully saved!");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving purchase:", error);
      alert("Something went wrong while saving. Please check the console for details.");
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex py-15 items-center text-gray-600 justify-center h-full bg-black/30 backdrop-blur-sm p-4">
      <div className="relative max-w-5xl w-full bg-white mt-10 rounded-2xl shadow-2xl overflow-y-auto max-h-screen">
        <div className="p-6 md:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Create Invoice</h1>

          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date" id="date" name="date" value={invoiceInfo.date} onChange={handleInfoChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="invoiceNo" className="block text-sm font-medium text-gray-700 mb-1">Invoice No.</label>
                <input
                  type="text" id="invoiceNo" name="invoiceNo" required value={invoiceInfo.invoiceNo} onChange={handleInfoChange}
                  placeholder="e.g., INV-001"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="dealer" className="block text-sm font-medium text-gray-700 mb-1">Dealer</label>
                <Combobox
                  options={dealerOptions}
                  value={invoiceInfo.dealer}
                  onChange={(value) => setInvoiceInfo(prev => ({ ...prev, dealer: value }))}
                  placeholder="Type or select dealer..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Items</h2>
              <div className="hidden md:grid md:grid-cols-[2fr_1fr_0.5fr_1fr_1fr_1fr_auto] gap-4 text-sm font-medium text-gray-500 px-2">
                <span>Name</span>
                <span>HSN</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Brand</span>
                <span>Category</span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_0.5fr_1fr_1fr_1fr_auto] gap-4 items-start p-3 bg-gray-50/50 text-gray-600 rounded-lg">
                  <Combobox
                    options={[...new Set(productOptions.map(opt => opt.name))]}
                    value={item.name}
                    onChange={(value) => handleItemChange(item.id, 'name', value)}
                    placeholder="Search or add new item..."
                  />
                  <input type="text" name="hsn" required value={item.hsn} onChange={(e) => handleItemChange(item.id, e.target.name, e.target.value)} placeholder="HSN Code" className="w-full p-2 border rounded-md bg-white" />
                  <input type="number" name="qty" required value={item.qty} onChange={(e) => handleItemChange(item.id, e.target.name, e.target.value)} placeholder="1" className="w-full p-2 border rounded-md bg-white" />
                  <input type="number" name="price" required value={item.price} onChange={(e) => handleItemChange(item.id, e.target.name, e.target.value)} placeholder="0.00" className="w-full p-2 border rounded-md bg-white" />
                  <input type="text" name="brand" value={item.brand} onChange={(e) => handleItemChange(item.id, e.target.name, e.target.value)} placeholder="Brand" className="w-full p-2 border rounded-md bg-white" />
                  <Combobox
                    options={categoryOptions.map(c => c.name)}
                    value={item.category}
                    onChange={(value) => handleItemChange(item.id, 'category', value)}
                    placeholder="Select or add category..."
                  />
                  <div className="flex items-center h-full justify-end md:justify-center">
                    <button type="button" onClick={() => handleRemoveItem(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={items.length <= 1}>
                      <XIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button type="button" onClick={handleAddItem} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors mb-4 sm:mb-0">
                Add Another Item
              </button>
              <button type="submit" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Save Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPurchase;
