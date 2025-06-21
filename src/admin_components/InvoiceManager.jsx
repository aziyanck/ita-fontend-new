import React, { useState } from "react"

//---------------------------------------------------//
// 1. FORM COMPONENT
//---------------------------------------------------//
const InvoiceForm = ({ onPreview }) => {
  // State for all form fields
  const [company] = useState({
    name: "Your Company Name",
    address: "123 Business Rd, Suite 456",
    city: "Metropolis",
    state: "State",
    gstin: "29ABCDE1234F1Z5",
    email: "billing@yourcompany.com",
    bankDetails: { bankName: "Global Bank", accountNo: "1234567890" },
  })

  const [customer, setCustomer] = useState({ name: "", address: "", gstin: "" })
  const [invoice, setInvoice] = useState({
    number: "",
    date: new Date().toISOString().slice(0, 10),
    declaration:
      "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
    items: [],
    installation: { amount: 0, hsn: "998739", taxRate: 18 },
  })

  const [errors, setErrors] = useState({})

  // --- Validation ---
  const validate = () => {
    const newErrors = {}
    if (!customer.name) newErrors.customerName = "Customer name is required"
    if (!customer.address)
      newErrors.customerAddress = "Customer address is required"
    if (!invoice.number) newErrors.invoiceNumber = "Invoice number is required"
    if (invoice.items.length === 0)
      newErrors.items = "At least one item is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- Event Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onPreview({ company, customer, invoice })
    }
  }

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(), // Unique ID for mapping
      name: `Sample Item #${invoice.items.length + 1}`,
      hsn: "8471",
      qty: 1,
      unitPrice: Math.floor(Math.random() * 2000) + 500, // Random price
      taxRate: 18,
      discount: 0,
    }
    setInvoice({ ...invoice, items: [...invoice.items, newItem] })
  }

  const handleRemoveItem = (id) => {
    setInvoice({ ...invoice, items: invoice.items.filter((i) => i.id !== id) })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow-sm bg-light"
    >
      <h3 className="mb-4">Create Invoice</h3>

      {/* Buyer Details */}
      <div className="card mb-3">
        <div className="card-header">Buyer Details</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className={`form-control ${errors.customerName ? "is-invalid" : ""}`}
                placeholder="Customer Name"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <div className="invalid-feedback">{errors.customerName}</div>
            </div>
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Customer GSTIN (Optional)"
                value={customer.gstin}
                onChange={(e) =>
                  setCustomer({ ...customer, gstin: e.target.value })
                }
              />
            </div>
            <div className="col-md-12">
              <textarea
                className={`form-control ${errors.customerAddress ? "is-invalid" : ""}`}
                placeholder="Customer Address"
                value={customer.address}
                onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
                }
              ></textarea>
              <div className="invalid-feedback">{errors.customerAddress}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Number */}
      <div className="card mb-3">
        <div className="card-header">Invoice Details</div>
        <div className="card-body">
          <input
            type="text"
            className={`form-control ${errors.invoiceNumber ? "is-invalid" : ""}`}
            placeholder="Invoice Number"
            value={invoice.number}
            onChange={(e) => setInvoice({ ...invoice, number: e.target.value })}
          />
          <div className="invalid-feedback">{errors.invoiceNumber}</div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Items</span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleAddItem}
          >
            Add Sample Item
          </button>
        </div>
        <div className="card-body">
          {errors.items && (
            <div className="alert alert-danger">{errors.items}</div>
          )}
          {invoice.items.map((item) => (
            <div key={item.id} className="row mb-2 align-items-center">
              <div className="col">{item.name}</div>
              <div className="col-auto">Qty: {item.qty}</div>
              <div className="col-auto">
                Price: ${parseFloat(item.unitPrice).toFixed(2)}
              </div>
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {invoice.items.length === 0 && (
            <p className="text-center text-muted">No items added yet.</p>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-success w-100">
        Preview Invoice
      </button>
    </form>
  )
}

//---------------------------------------------------//
// 2. PREVIEW COMPONENT
//---------------------------------------------------//
const InvoicePreview = ({ data, onEdit, onGenerate }) => {
  const { company, customer, invoice } = data
  const subtotal = invoice.items.reduce(
    (total, item) => total + item.qty * item.unitPrice,
    0,
  )

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="mb-4">Invoice Preview</h3>
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <span>Invoice #{invoice.number}</span>
          <span>Date: {new Date(invoice.date).toLocaleDateString()}</span>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-6">
              <strong>From:</strong>
              <p className="mb-0">{company.name}</p>
              <p className="mb-0">{company.address}</p>
            </div>
            <div className="col-6">
              <strong>To:</strong>
              <p className="mb-0">{customer.name}</p>
              <p className="mb-0">{customer.address}</p>
            </div>
          </div>
          <hr />
          <h5>Items</h5>
          <ul className="list-group mb-3">
            {invoice.items.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {item.name} (Qty: {item.qty})
                </span>
                <span>${(item.qty * item.unitPrice).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <h4 className="text-end">Subtotal: ${subtotal.toFixed(2)}</h4>
        </div>
      </div>
      <div className="mt-4 d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={onEdit}>
          Back to Edit
        </button>
        <button className="btn btn-primary" onClick={onGenerate}>
          Generate & Save Invoice
        </button>
      </div>
    </div>
  )
}

//---------------------------------------------------//
// 3. MAIN COMPONENT (EXPORT THIS ONE)
//---------------------------------------------------//
function InvoiceManager() {
  const [invoiceData, setInvoiceData] = useState(null)
  const [isPreview, setIsPreview] = useState(false)

  const handlePreview = (data) => {
    setInvoiceData(data)
    setIsPreview(true)
  }

  const handleEdit = () => {
    setIsPreview(false)
  }

  const handleGenerateInvoice = async () => {
    if (!invoiceData) return

    // Use your actual backend URL here
    const API_URL = "https://your-backend.dev/api/invoices"
    alert(
      `This will send the following data to ${API_URL}:\n\n${JSON.stringify(invoiceData, null, 2)}`,
    )

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) throw new Error("Network response was not ok.")

      const result = await response.json()
      alert(
        "Invoice saved successfully! Server Response: " +
          JSON.stringify(result),
      )

      // Reset state after successful generation
      setIsPreview(false)
      setInvoiceData(null)
    } catch (error) {
      console.error("Error posting invoice data:", error)
      alert("Error: Could not save the invoice. Check the console for details.")
    }
  }

  return (
    <div className="container mt-5 mb-5">
      {isPreview ? (
        <InvoicePreview
          data={invoiceData}
          onEdit={handleEdit}
          onGenerate={handleGenerateInvoice}
        />
      ) : (
        <InvoiceForm onPreview={handlePreview} />
      )}
    </div>
  )
}

export default InvoiceManager
