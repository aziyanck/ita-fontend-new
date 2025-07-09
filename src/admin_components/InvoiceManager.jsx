import React, { useState, useMemo, useEffect, useRef } from "react"
import {
  updateComponentQty,
  getComponentDetails,
  getAllComponents,
  getLatestInvoiceNumber,
  insertInvoice,
  insertSellItem,
} from "./supabaseServices"

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

const ChevronUpDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
    />
  </svg>
)

const Combobox = ({ options, value, onChange, placeholder }) => {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        )

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange(newValue)
    if (!isOpen) setIsOpen(true)
  }

  const handleOptionClick = (optionValue) => {
    onChange(optionValue)
    setQuery("")
    setIsOpen(false)
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false)
          }}
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
              {query ? "No match found." : "Type to search..."}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

// Main component that manages both the form and the preview state.
function InvoiceManager() {
  const [componentOptions, setComponentOptions] = useState([])
  // State now includes a company object to be managed by the form.
  const [invoiceData, setInvoiceData] = useState({
    company: {
      name: "Industech Automations",
      address: "25-B, Kuruvikkaran Salai",
      city: "Madurai-625009",
      state: "Tamil Nadu",
      country: "India",
      gstin: "33CHVPD3453N1ZW",
      email: "industechautomations@gmail.com",
      bankDetails: {
        bankName: "STATE BANK OF INDIA",
        accountNo: "1234567890",
        branch: "Madurai Main",
        ifsc: "SBIN0001234",
      },
    },
    customer: {
      name: "",
      address: "",
      gstin: "",
      email: "",
      orderNo: "",
      destination: "",
      supplierRef: "",
    },
    invoice: {
      number: "",
      date: new Date().toISOString().slice(0, 10),
      items: [
        {
          id: Date.now(),
          name: "",
          hsn: "",
          qty: "",
          unitPrice: "",
          taxRate: "",
          discount: "",
        },
      ],
      notes: "",
      declaration:
        "We declare this invoice reflects correct and actual transaction details.",
    },
    installationCharge: "",
  })

  // State to toggle between the form and the preview view.
  const [isPreview, setIsPreview] = useState(false)

  // State to display status of operations --> null | "pending" | "success"
  const [generationStatus, setGenerationStatus] = useState(null)

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const components = await getAllComponents()
        setComponentOptions(components)
      } catch (error) {
        console.error("Error fetching components:", error)
        showMessageBox("Could not load components. Please refresh.")
      }
    }
    fetchComponents()

    const fetchLatestInvoiceNumber = async () => {
      const latestInvoiceNo = await getLatestInvoiceNumber()
      if (latestInvoiceNo) {
        const parts = latestInvoiceNo.split("/")
        const lastPart = parseInt(parts[parts.length - 1], 10)
        const newPart = (lastPart + 1).toString().padStart(2, "0")
        const newInvoiceNo = `ITA/25-26/${newPart}`
        setInvoiceData((prev) => ({
          ...prev,
          invoice: { ...prev.invoice, number: newInvoiceNo },
        }))
      } else {
        setInvoiceData((prev) => ({
          ...prev,
          invoice: { ...prev.invoice, number: "ITA/25-26/01" },
        }))
      }
    }

    fetchLatestInvoiceNumber()
  }, [])

  // --- Helper Functions & Calculations ---

  const showMessageBox = (message) => {
    const existingMessageBox = document.getElementById("custom-message-box")
    if (existingMessageBox) document.body.removeChild(existingMessageBox)

    const messageBox = document.createElement("div")
    messageBox.id = "custom-message-box"
    messageBox.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center flex flex-col items-center max-w-sm mx-auto">
        <p class="text-lg text-gray-700 font-semibold mb-4">${message}</p>
        <button id="close-message" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Close</button>
      </div>
    `
    document.body.appendChild(messageBox)
    document.getElementById("close-message").onclick = () => {
      document.body.removeChild(messageBox)
    }
  }

  const totals = useMemo(() => {
    const subtotal = invoiceData.invoice.items.reduce((acc, item) => {
      const itemTotal =
        (parseFloat(item.qty) || 0) * (parseFloat(item.unitPrice) || 0)
      const discountAmount =
        itemTotal * ((parseFloat(item.discount) || 0) / 100)
      return acc + (itemTotal - discountAmount)
    }, 0)

    const tax = subtotal * 0.18
    const installation = parseFloat(invoiceData.installationCharge) || 0
    const total = subtotal + tax + installation
    return { subtotal, tax, installation, total }
  }, [invoiceData.invoice.items, invoiceData.installationCharge])

  // --- Event Handlers for Form ---

  const handleNestedChange = (section, field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const handleBankDetailsChange = (field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        bankDetails: {
          ...prev.company.bankDetails,
          [field]: value,
        },
      },
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.invoice.items]
    newItems[index][field] = value

    if (field === "name") {
      const selectedComponent = componentOptions.find((c) => c.name === value)
      if (selectedComponent) {
        newItems[index].hsn = selectedComponent.hsn
        newItems[index].componentId = selectedComponent.id // Save the component ID
      } else {
        newItems[index].hsn = "" // Clear HSN if component not found
        newItems[index].componentId = null // Clear component ID
      }
    }

    if (field === "qty") {
      const componentName = newItems[index].name
      if (componentName) {
        const component = componentOptions.find((c) => c.name === componentName)
        if (component) {
          const requestedQty = parseFloat(value)
          if (requestedQty > component.qty) {
            showMessageBox(
              `Not enough stock for "${component.name}". Only ${component.qty} available.`,
            )
            newItems[index][field] = component.qty.toString()
          }
        }
      }
    }
    setInvoiceData((prev) => ({
      ...prev,
      invoice: { ...prev.invoice, items: newItems },
    }))
  }

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        items: [
          ...prev.invoice.items,
          {
            id: Date.now(),
            name: "",
            hsn: "",
            qty: "",
            unitPrice: "",
            taxRate: "",
            discount: "",
          },
        ],
      },
    }))
  }

  const removeItem = (index) => {
    setInvoiceData((prev) => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        items: prev.invoice.items.filter((_, i) => i !== index),
      },
    }))
  }

  const validateForm = () => {
    if (
      !invoiceData.customer.name.trim() ||
      !invoiceData.customer.address.trim() ||
      !invoiceData.customer.email.trim() ||
      !invoiceData.invoice.number.trim()
    ) {
      showMessageBox(
        "Please fill in all required fields: Customer Name, Address, Email, and Invoice Number.",
      )
      return false
    }
    if (invoiceData.invoice.items.length === 0) {
      showMessageBox("At least one item is required.")
      return false
    }
    for (let i = 0; i < invoiceData.invoice.items.length; i++) {
      const item = invoiceData.invoice.items[i]
      if (!item.name.trim() || !item.hsn.trim()) {
        showMessageBox(`Item #${i + 1}: Description and HSN are required.`)
        return false
      }
      const componentExists = componentOptions.some((c) => c.name === item.name)
      if (!componentExists) {
        showMessageBox(
          `Item #${i + 1}: "${item.name}" is not a valid component.`,
        )
        return false
      }

      const component = componentOptions.find((c) => c.name === item.name)
      if (component && parseFloat(item.qty) > component.qty) {
        showMessageBox(
          `Not enough stock for "${item.name}". Only ${component.qty} available.`,
        )
        return false
      }
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsPreview(true)
    }
  }

  // --- Event Handlers for Preview ---

  const handleEdit = () => {
    setIsPreview(false)
  }

  const handleGenerateInvoice = async () => {
    setGenerationStatus("pending")

    const processedItems = invoiceData.invoice.items.map((item) => ({
      ...item,
      qty: parseFloat(item.qty) || 0,
      unitPrice: parseFloat(item.unitPrice) || 0,
      discount: parseFloat(item.discount) || 0,
      taxRate: parseFloat(item.taxRate) || 18,
    }))

    const payload = {
      company: invoiceData.company,
      customer: invoiceData.customer,
      invoice: {
        ...invoiceData.invoice,
        items: processedItems,
      },
      email: invoiceData.customer.email,
      Installation: parseFloat(invoiceData.installationCharge) || 0,
    }

    const API_URL = "https://jobqueue.onrender.com/geninvoice"
    console.log("Submitting to backend:", JSON.stringify(payload, null, 2))

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.status || "Request failed")
      }

      setGenerationStatus("success")

      // Insert into invoices table
      const invoicePayload = {
        date: invoiceData.invoice.date,
        invoice_no: invoiceData.invoice.number,
        invoice_type: "sell",
        total_amount: totals.total,
        customer: invoiceData.customer.name,
        url: result.url,
      }
      await insertInvoice(invoicePayload)

      // Update component quantities and insert into sell_items table
      for (const item of processedItems) {
        if (item.componentId) {
          const currentComponent = await getComponentDetails(item.componentId)
          const newQty = currentComponent.qty - item.qty
          await updateComponentQty(item.componentId, newQty)

          const sellItemPayload = {
            comp_id: item.componentId,
            invoice_no: invoiceData.invoice.number,
            qty: item.qty,
            price: item.unitPrice,
            date: invoiceData.invoice.date,
          }
          await insertSellItem(sellItemPayload)
        }
      }

      // Refresh component list to get updated quantities
      const updatedComponents = await getAllComponents()
      setComponentOptions(updatedComponents)
    } catch (error) {
      console.error("Error submitting invoice job:", error)
      setGenerationStatus(null)
      showMessageBox(`Error: ${error.message}. Check console for details.`)
    }
  }

  // --- Render Logic ---

  if (isPreview) {
    return (
      <div className="flex flex-col items-center p-4 bg-gray-100 w-full max-w-screen min-h-screen font-sans">
        <div className="bg-white overflow-x-scroll w-screen p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Invoice Preview
          </h2>
          <div className="flex justify-between mb-8">
            <h4 className="font-bold text-gray-700 mb-2">
              To: {invoiceData.customer.name}
            </h4>
            <h4 className="font-bold text-gray-700 mb-2">
              Invoice: #{invoiceData.invoice.number}
            </h4>
          </div>
          <div className="overflow-x-scroll mb-8">
            <table className="min-w-full bg-white border border-gray-300 rounded-md">
              <thead className="bg-gray-100">
                <tr className="text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-4 border-b">#</th>
                  <th className="py-3 px-4 border-b">Item</th>
                  <th className="py-3 px-4 border-b text-right">Qty</th>
                  <th className="py-3 px-4 border-b text-right">Price</th>
                  <th className="py-3 px-4 border-b text-right">
                    Discount (%)
                  </th>
                  <th className="py-3 px-4 border-b text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.invoice.items.map((item, idx) => {
                  const itemTotal =
                    (parseFloat(item.qty) || 0) *
                    (parseFloat(item.unitPrice) || 0)
                  const discountAmount =
                    itemTotal * ((parseFloat(item.discount) || 0) / 100)
                  const finalAmount = itemTotal - discountAmount
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-4 text-sm text-gray-800">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800">
                        {item.name}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 text-right">
                        {item.qty}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 text-right">
                        ₹{parseFloat(item.unitPrice).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 text-right">
                        {parseFloat(item.discount).toFixed(2)}%
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 text-right">
                        ₹{finalAmount.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-xs text-gray-700">
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Installation</span>
                <span>₹{totals.installation.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>GST (18% - Preview)</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-gray-300 mt-2">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">
                  ₹{totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {generationStatus === "pending" && (
            <p className="text-center mb-4 text-yellow-600 font-medium">
              Generating PDF...
            </p>
          )}
          {generationStatus === "success" && (
            <p className="text-center mb-4 text-green-600 font-medium">
              Completed.
            </p>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleGenerateInvoice}
              className="submit-button bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md shadow-md"
            >
              Submit for PDF Generation
            </button>
            <button
              onClick={handleEdit}
              className="edit-button bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-md shadow-md"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 text-gray-700 w-full p-4 md:p-8 bg-white shadow-lg rounded-lg max-w-6xl mx-auto my-8 font-sans"
    >
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Create Invoice
      </h2>

      {/* Company Details Section */}
      <div className="space-y-4 p-4 border bg-gray-100 border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800">
          Your Company Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Company Name"
            value={invoiceData.company.name}
            onChange={(e) =>
              handleNestedChange("company", "name", e.target.value)
            }
          />
          <input
            type="email"
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Company Email"
            value={invoiceData.company.email}
            onChange={(e) =>
              handleNestedChange("company", "email", e.target.value)
            }
          />
          <input
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Company GSTIN"
            value={invoiceData.company.gstin}
            onChange={(e) =>
              handleNestedChange("company", "gstin", e.target.value)
            }
          />
          <input
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Country"
            value={invoiceData.company.country}
            onChange={(e) =>
              handleNestedChange("company", "country", e.target.value)
            }
          />
        </div>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Company Address"
          value={invoiceData.company.address}
          onChange={(e) =>
            handleNestedChange("company", "address", e.target.value)
          }
        />
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="City & Pincode"
          value={invoiceData.company.city}
          onChange={(e) =>
            handleNestedChange("company", "city", e.target.value)
          }
        />

        <h4 className="text-lg font-semibold text-gray-700 pt-2">
          Bank Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Bank Name"
            value={invoiceData.company.bankDetails.bankName}
            onChange={(e) =>
              handleBankDetailsChange("bankName", e.target.value)
            }
          />
          <input
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Account No."
            value={invoiceData.company.bankDetails.accountNo}
            onChange={(e) =>
              handleBankDetailsChange("accountNo", e.target.value)
            }
          />
          <input
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Branch"
            value={invoiceData.company.bankDetails.branch}
            onChange={(e) => handleBankDetailsChange("branch", e.target.value)}
          />
          <input
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="IFSC Code"
            value={invoiceData.company.bankDetails.ifsc}
            onChange={(e) => handleBankDetailsChange("ifsc", e.target.value)}
          />
        </div>
      </div>

      {/* Buyer Details Section */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800">Buyer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Customer Name"
            value={invoiceData.customer.name}
            onChange={(e) =>
              handleNestedChange("customer", "name", e.target.value)
            }
          />
          <input
            type="email"
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Customer Email"
            value={invoiceData.customer.email}
            onChange={(e) =>
              handleNestedChange("customer", "email", e.target.value)
            }
          />
          <input
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Customer GSTIN (Optional)"
            value={invoiceData.customer.gstin}
            onChange={(e) =>
              handleNestedChange("customer", "gstin", e.target.value)
            }
          />
        </div>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
          placeholder="Customer Address"
          value={invoiceData.customer.address}
          onChange={(e) =>
            handleNestedChange("customer", "address", e.target.value)
          }
        />
      </div>

      {/* Invoice Meta Section */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Invoice Number"
            value={invoiceData.invoice.number}
            onChange={(e) =>
              handleNestedChange("invoice", "number", e.target.value)
            }
          />
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={invoiceData.invoice.date}
            onChange={(e) =>
              handleNestedChange("invoice", "date", e.target.value)
            }
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Items</h3>
        {invoiceData.invoice.items.map((item, i) => {
          const itemTotal =
            (parseFloat(item.qty) || 0) * (parseFloat(item.unitPrice) || 0)
          const discountAmount =
            itemTotal * ((parseFloat(item.discount) || 0) / 100)
          const finalAmount = itemTotal - discountAmount
          return (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-2 items-center p-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="col-span-2 md:col-span-1 text-center font-medium">
                {i + 1}
              </div>
              <div className="col-span-10 md:col-span-3">
                <Combobox
                  options={[
                    ...new Set(componentOptions.map((opt) => opt.name)),
                  ]}
                  value={item.name}
                  onChange={(value) => handleItemChange(i, "name", value)}
                  placeholder="Item/Service Description"
                />
              </div>
              <input
                className="col-span-12 md:col-span-2 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="HSN"
                value={item.hsn}
                onChange={(e) => handleItemChange(i, "hsn", e.target.value)}
              />
              <input
                type="number"
                className="col-span-3 md:col-span-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => handleItemChange(i, "qty", e.target.value)}
              />
              <input
                type="number"
                className="col-span-3 md:col-span-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Price"
                value={item.unitPrice}
                onChange={(e) =>
                  handleItemChange(i, "unitPrice", e.target.value)
                }
              />
              <input
                type="number"
                className="col-span-3 md:col-span-2 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Discount (%)"
                value={item.discount}
                onChange={(e) =>
                  handleItemChange(i, "discount", e.target.value)
                }
              />
              <input
                className="col-span-3 md:col-span-1 px-3 py-2 border bg-gray-100 border-gray-300 rounded-md text-right"
                value={`₹${finalAmount.toFixed(2)}`}
                disabled
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="col-span-2 md:col-span-1 px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                X
              </button>
            </div>
          )
        })}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Item / Charge
        </button>
      </div>

      {/* Installation Charge Section */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800">
          Installation Charge
        </h3>
        <input
          className="px-3 py-2 border border-gray-300 rounded-md w-full"
          placeholder="Installation Charge (₹)"
          type="number"
          value={invoiceData.installationCharge}
          onChange={(e) =>
            setInvoiceData((prev) => ({
              ...prev,
              installationCharge: e.target.value,
            }))
          }
        />
      </div>

      {/* Notes & Declaration */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800">
          Notes & Declaration
        </h3>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Notes (Optional)"
          value={invoiceData.invoice.notes}
          onChange={(e) =>
            handleNestedChange("invoice", "notes", e.target.value)
          }
        />
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Declaration"
          value={invoiceData.invoice.declaration}
          onChange={(e) =>
            handleNestedChange("invoice", "declaration", e.target.value)
          }
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Preview Invoice
      </button>
    </form>
  )
}

export default InvoiceManager
