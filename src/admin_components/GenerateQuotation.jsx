import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import "./Form.css";

const materialsFromBackend = [
  "Cement", "Bricks", "Sand", "Steel", "Paint", "Tiles", "Wood", "Glass", "Aluminum", "Copper",
  "Pipes", "Cables", "Fixtures", "Adhesives", "Insulation", "Drywall", "Plaster", "Concrete",
  "Roofing Shingles", "Gutters", "Windows", "Doors", "Cabinets", "Countertops", "Flooring",
  "Lighting", "Electrical Outlets", "Switches", "Ventilation Fans", "Water Heaters",
  "HVAC Units", "Plumbing Fixtures", "Sinks", "Toilets", "Bathtubs", "Showers", "Mirrors"
];

const defaultTerms = [
  "70% of advance payment due before installation.",
  "Delivery within 7 working days from order confirmation.",
  "Warranty as per manufacturer terms.",
  "This quotation is valid for 14 days."
];

const Form = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    place: "",
    email: "",
    date: new Date().toISOString().slice(0, 10),
    materials: [
      { description: "", hsn: "", qty: "", unitPrice: "", amount: 0, isDropdownOpen: false, currentSearchTerm: "", highlightedIndex: -1 }
    ],
    installationCharge: "",
    selectedDefaultTerms: Array(defaultTerms.length).fill(false),
    customTerms: [""],
    quoteIntro: "We are pleased to quote our best prices for the following items"
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [submissionResponse, setSubmissionResponse] = useState(null);

  // Refs for each material's input and dropdown list for managing focus and scroll
  // This ref pattern ensures we have a ref for each dynamic element.
  const materialRefs = useRef([]);
  // Ensure materialRefs.current is always up-to-date with the number of materials
  materialRefs.current = formData.materials.map(
    (item, i) => materialRefs.current[i] || { inputRef: React.createRef(), ulRef: React.createRef() }
  );

  // Helper to update individual material fields, including dropdown-related states
  const updateMaterial = useCallback((index, field, value) => {
    setFormData(prevFormData => {
      const materials = [...prevFormData.materials];
      const materialToUpdate = { ...materials[index] };

      if (["qty", "unitPrice"].includes(field)) {
        const numericValue = parseFloat(value);
        if (numericValue < 0) return prevFormData;
        materialToUpdate[field] = value;
      } else if (field === "description") {
        // This handles typing into the input field
        materialToUpdate.description = value; // This is the actual value that will be saved
        materialToUpdate.currentSearchTerm = value; // This is for the input field display
        materialToUpdate.isDropdownOpen = true; // Open dropdown on type
        materialToUpdate.highlightedIndex = -1; // Reset highlight on new search
      } else if (field === "selectDescription") {
        // This handles selecting an item from the dropdown
        materialToUpdate.description = value;
        materialToUpdate.currentSearchTerm = value;
        materialToUpdate.isDropdownOpen = false;
        materialToUpdate.highlightedIndex = -1;
      } else if (field === "setDropdownOpen") {
        materialToUpdate.isDropdownOpen = value;
        if (!value) materialToUpdate.highlightedIndex = -1;
      } else if (field === "setHighlightedIndex") {
        materialToUpdate.highlightedIndex = value;
      } else {
        materialToUpdate[field] = value;
      }

      // Recalculate amount
      const qty = parseFloat(materialToUpdate.qty) || 0;
      const unitPrice = parseFloat(materialToUpdate.unitPrice) || 0;
      materialToUpdate.amount = qty * unitPrice;

      materials[index] = materialToUpdate;
      return { ...prevFormData, materials };
    });
  }, []);

  // Effect to scroll highlighted item into view for each specific dropdown
  // This useEffect is outside the map function to adhere to Rules of Hooks
  useEffect(() => {
    formData.materials.forEach((mat, i) => {
      if (mat.isDropdownOpen && mat.highlightedIndex >= 0) {
        const ulElement = materialRefs.current[i]?.ulRef.current;
        if (ulElement) {
          const highlightedElement = ulElement.children[mat.highlightedIndex];
          if (highlightedElement) {
            highlightedElement.scrollIntoView({ block: 'nearest' });
          }
        }
      }
    });
  }, [formData.materials]); // Dependency on the entire materials array to react to changes in any material's state


  const removeMaterial = (index) => {
    setFormData(prevFormData => {
      const materials = [...prevFormData.materials];
      materials.splice(index, 1);
      // Remove the corresponding ref entry
      materialRefs.current.splice(index, 1);
      return { ...prevFormData, materials };
    });
  };

  const addMaterial = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      materials: [...prevFormData.materials, { description: "", hsn: "", qty: "", unitPrice: "", amount: 0, isDropdownOpen: false, currentSearchTerm: "", highlightedIndex: -1 }]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      { name: "Customer Name", value: formData.customerName },
      { name: "Place", value: formData.place },
    ];

    for (let i = 0; i < formData.materials.length; i++) {
      const mat = formData.materials[i];
      if (!mat.description.trim()) return showMessageBox(`Material ${i + 1}: Description is required.`);
      if (!mat.hsn.trim()) return showMessageBox(`Material ${i + 1}: HSN is required.`);
      if (!mat.qty.toString().trim()) return showMessageBox(`Material ${i + 1}: Quantity is required.`);
      if (!mat.unitPrice.toString().trim()) return showMessageBox(`Material ${i + 1}: Unit Price is required.`);
    }

    for (const field of requiredFields) {
      if (!field.value.trim()) {
        showMessageBox(`${field.name} is required.`);
        return;
      }
    }

    setSubmittedData(formData);
  };

  const toWords = (n) => {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const numberToWords = (num) => {
      if (num < 20) return a[num];
      if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
      if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " and " + numberToWords(num % 100) : "");
      if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
      if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numberToWords(num % 100000) : "");
      return numberToWords(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + numberToWords(Math.floor(num % 10000000)) : "");
    };
    return numberToWords(n);
  };

  const showMessageBox = (message) => {
    const messageBox = document.createElement('div');
    messageBox.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center flex flex-col items-center">
        <p class="text-xl text-gray-700 font-semibold mb-4">${message}</p>
        <button id="close-message" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Close</button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById('close-message').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  const sendInvoice = async () => {
    if (!submittedData) return;
    const items = submittedData.materials.map((mat) => ({
      name: mat.description,
      hsn: mat.hsn,
      qty: Number(mat.qty),
      unitPrice: Number(mat.unitPrice),
      amount: Number(mat.amount),
    }));
    const installationCharge = parseFloat(submittedData.installationCharge) || 0;
    const untaxedAmount = items.reduce((acc, item) => acc + item.amount, 0) + installationCharge;
    const sgst = untaxedAmount * 0.09;
    const cgst = untaxedAmount * 0.09;
    const total = untaxedAmount + sgst + cgst;
    const now = new Date();
    const quotationNo = "ITA" +
      String(now.getDate()).padStart(2, '0') +
      String(now.getMonth() + 1).padStart(2, '0') +
      now.getFullYear() +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0');

    const payload = {
      date: submittedData.date,
      quotationNo,
      recipientName: submittedData.customerName,
      recipientAddress: submittedData.place,
      email: submittedData.email,
      items,
      installationCharge,
      untaxedAmount,
      sgst,
      cgst,
      total,
      totalInWords: toWords(Math.round(total)) + " Rupees only",
      terms: [
        ...defaultTerms.filter((_, i) => formData.selectedDefaultTerms[i]),
        ...formData.customTerms.filter(t => t.trim() !== "")
      ],
    };

    try {
      const res = await axios.post("https://jobqueue.onrender.com/genquotation", payload);
      setSubmissionResponse(res.data);
      showMessageBox("Quotation generated successfully!");
    } catch (err) {
      console.error("Failed to generate quotation:", err);
      showMessageBox("Failed to generate quotation. Please try again.");
    }
  };

  const goBackToEdit = () => {
    setSubmittedData(null);
  };

  return submittedData ? (
    <div className="flex flex-col justify-center w-full max-w-screen items-center p-4 bg-gray-100 min-h-screen font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-screen w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Quotation Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
          <p><strong>Customer:</strong> {submittedData.customerName}</p>
          <p><strong>Location:</strong> {submittedData.place}</p>
          <p><strong>Date:</strong> {submittedData.date}</p>
        </div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Materials</h3>
        <div className="overflow-x-scroll mb-6">
          <table className="min-w-full bg-white border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4 border-b">S.No</th>
                <th className="py-3 px-4 border-b">Description</th>
                <th className="py-3 px-4 border-b">Qty</th>
                <th className="py-3 px-4 border-b">Unit Price</th>
                <th className="py-3 px-4 border-b">Amount</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.materials.map((mat, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-800">{idx + 1}</td>
                  <td className="py-2 px-4 text-sm text-gray-800">{mat.description}</td>
                  <td className="py-2 px-4 text-sm text-gray-800">{mat.qty}</td>
                  <td className="py-2 px-4 text-sm text-gray-800">₹{mat.unitPrice}</td>
                  <td className="py-2 px-4 text-sm text-gray-800">₹{Number(mat.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h4 className="text-lg font-semibold mb-3 text-gray-800">Terms & Conditions</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
          {[...defaultTerms.filter((_, i) => submittedData.selectedDefaultTerms[i]),
          ...submittedData.customTerms.filter(t => t.trim() !== "")]
            .map((term, idx) => <li key={idx}>{term}</li>)
          }
        </ul>
        <div className="flex justify-center space-x-4">
          <button
            className="submit-button bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={sendInvoice}
          >
            Generate Quotation
          </button>
          <button
            className="edit-button bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={goBackToEdit}
          >
            Edit Details
          </button>
        </div>
      </div>
    </div>
  ) : (

    <div className="w-screen md:w-full  flex justify-center items-start ">
      <form onSubmit={handleSubmit} className="flex flex-col  md:scale-100 gap-4 text-gray-700 w-screen md:max-w-xl  p-4 md:p-8 bg-white shadow-lg rounded-lg lg:max-w-4xl  my-8 font-sans">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Create Quotation</h2>

        <input
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Customer Name"
          value={formData.customerName}
          onChange={e => setFormData({ ...formData, customerName: e.target.value })}
        />
        <input
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Place"
          value={formData.place}
          onChange={e => setFormData({ ...formData, place: e.target.value })}
        />
        <input
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="date"
          value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
        />
        <input
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Customer email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        />
        <textarea
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-y"
          value={formData.quoteIntro}
          onChange={e => setFormData({ ...formData, quoteIntro: e.target.value })}
        />

        <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Materials</h3>

        {formData.materials.map((mat, i) => {
          const filteredSuggestions = materialsFromBackend.filter(m =>
            m.toLowerCase().includes(mat.currentSearchTerm.toLowerCase())
          );

          return (
            <div key={i} className="material-row grid grid-cols-1 md:grid-cols-7 gap-2 items-center border border-gray-200 p-3 rounded-md shadow-sm">
              <div className="col-span-1 text-center font-medium text-gray-700">{i + 1}</div>
              <div className="dropdown-container text-gray-700  relative col-span-2">
                <input
                  ref={materialRefs.current[i]?.inputRef} // Direct ref to the input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type or select material"
                  value={mat.currentSearchTerm}
                  onFocus={() => {
                    updateMaterial(i, "setDropdownOpen", true);
                    // When focused, set search term to current description value
                    updateMaterial(i, "description", mat.description);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      updateMaterial(i, "setDropdownOpen", false);
                    }, 150);
                  }}
                  onChange={(e) => updateMaterial(i, "description", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      if (filteredSuggestions.length > 0) {
                        updateMaterial(i, 'setHighlightedIndex', (mat.highlightedIndex + 1) % filteredSuggestions.length);
                      }
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      if (filteredSuggestions.length > 0) {
                        updateMaterial(i, 'setHighlightedIndex', (mat.highlightedIndex - 1 + filteredSuggestions.length) % filteredSuggestions.length);
                      }
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (mat.highlightedIndex >= 0 && filteredSuggestions[mat.highlightedIndex]) {
                        updateMaterial(i, "selectDescription", filteredSuggestions[mat.highlightedIndex]);
                        materialRefs.current[i].inputRef.current.blur(); // Blur the input
                      } else if (filteredSuggestions.length === 1 && mat.currentSearchTerm.toLowerCase() === filteredSuggestions[0].toLowerCase()) {
                        // If only one option matches exactly, select it on Enter
                        updateMaterial(i, "selectDescription", filteredSuggestions[0]);
                        materialRefs.current[i].inputRef.current.blur();
                      } else {
                        updateMaterial(i, "setDropdownOpen", false);
                      }
                    } else if (e.key === 'Escape') {
                      updateMaterial(i, "setDropdownOpen", false);
                      materialRefs.current[i].inputRef.current.blur();
                    }
                  }}
                  autoComplete="off"
                />
                {mat.isDropdownOpen && (filteredSuggestions.length > 0 || mat.currentSearchTerm) && (
                  <ul
                    className="dropdown-list absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto"
                    ref={materialRefs.current[i]?.ulRef}
                  >
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((s, idx) => (
                        <li
                          key={idx}
                          className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700
                          ${idx === mat.highlightedIndex ? 'bg-indigo-100 text-indigo-800' : ''}`}
                          onClick={() => {
                            updateMaterial(i, "selectDescription", s);
                            materialRefs.current[i].inputRef.current.blur(); // Blur the input
                          }}
                          onMouseEnter={() => updateMaterial(i, 'setHighlightedIndex', idx)}
                        >
                          {s}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500 italic">No matching materials found</li>
                    )}
                  </ul>
                )}
              </div>

              
                <input
                className="px-3 py-2 border border-gray-300 col-span-3 lg:col-span-1 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="HSN"
                value={mat.hsn}
                onChange={e => updateMaterial(i, 'hsn', e.target.value)}
              />
              

              
                <input
                className="px-3 py-2 border col-span-3 lg:col-span-1 border-gray-300 text-gray-700  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                placeholder="Qty"
                value={mat.qty}
                onChange={e => updateMaterial(i, 'qty', e.target.value)}
              />
              
              
              <input
                className="px-3 py-2 border col-span-3 lg:col-span-1 border-gray-300 text-gray-700  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                placeholder="Unit Price"
                value={mat.unitPrice}
                onChange={e => updateMaterial(i, 'unitPrice', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeMaterial(i)}
                className="px-3 py-2 col-span-3 md:col-span-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addMaterial}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Material
        </button>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">Installation Charges</h3>
        <input
          className="px-3 py-2 border border-gray-300 text-gray-700  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="number"
          min="0"
          placeholder="Installation Charges (₹)"
          value={formData.installationCharge}
          onChange={e => setFormData({ ...formData, installationCharge: e.target.value })}
        />

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">Terms & Conditions</h3>
        <h4 className="text-lg font-medium mb-2 text-gray-700">Default Terms</h4>
        {defaultTerms.map((term, i) => (
          <label key={i} className="term-checkbox flex items-center space-x-2 text-gray-700">
            <input
              type="checkbox"
              checked={formData.selectedDefaultTerms[i]}
              onChange={() => {
                const updated = [...formData.selectedDefaultTerms];
                updated[i] = !updated[i];
                setFormData({ ...formData, selectedDefaultTerms: updated });
              }}
              className="form-checkbox h-4 w-4 text-indigo-600 rounded"
            />
            <span>{term}</span>
          </label>
        ))}

        <h4 className="text-lg font-medium mt-4 mb-2 text-gray-700">Custom Terms</h4>
        {formData.customTerms.map((term, i) => (
          <div key={i} className="term-row  flex items-center justify-center flex-wrap space-x-2">
            <input
              className="flex-grow  py-2 border border-gray-300 text-gray-700  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={term}
              onChange={e => {
                const updated = [...formData.customTerms];
                updated[i] = e.target.value;
                setFormData({ ...formData, customTerms: updated });
              }}
            />
            <button
              type="button"
              onClick={() => {
                const updated = [...formData.customTerms];
                updated.splice(i, 1);
                setFormData({ ...formData, customTerms: updated });
              }}
              className="px-3 m-2 py-2  bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData({
            ...formData,
            customTerms: [...formData.customTerms, ""]
          })}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Add Custom Term
        </button>

        <button
          type="submit"
          className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Submit Quotation
        </button>
      </form>
    </div>

  );
};

export default Form;
