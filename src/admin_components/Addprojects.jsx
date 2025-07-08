import React, { useState, useEffect } from 'react';

export default function AddProject({ onSave, onClose, mode, projectToEdit, initialStatus }) {
  const initialEmptyRow = {
    date: '', clientName: '', contact: '', project: '',
    location: '', invoiceNo: '', quotedValue: '',
    finalValue: '', matExpenses: '', labour: '', ta: ''
  };

  const [rows, setRows] = useState([initialEmptyRow]);

  useEffect(() => {
    if (mode === 'edit' && projectToEdit) {
      setRows([projectToEdit]);
    } else {
      setRows([initialEmptyRow]);
    }
  }, [mode, projectToEdit]);

  const addRow = () => setRows([...rows, initialEmptyRow]);

  const removeRow = (index) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const calculateProfit = (row) => {
    const final = parseFloat(row.finalValue || 0);
    const mat = parseFloat(row.matExpenses || 0);
    const labour = parseFloat(row.labour || 0);
    const ta = parseFloat(row.ta || 0);
    return final - (mat + labour + ta);
  };

  const handleSave = (status) => {
    if (mode === 'edit') {
      onSave({ ...rows[0], status: status || rows[0].status });
    } else {
      const validRows = rows.filter(r =>
        r.project?.trim() &&
        r.clientName?.trim() &&
        r.contact?.trim()
      );

      if (validRows.length === rows.length) {
        onSave({ projects: validRows, status });
      } else {
        alert("Please fill in Project Name, Client Name and Contact Number for all rows.");
      }
    }
  };


  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 100
    }}>
      <div style={{
        backgroundColor: 'white', padding: '2rem', borderRadius: '8px',
        width: '95%', maxWidth: '1400px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
            {mode === 'edit' ? 'Edit Project' : 'Add New Projects'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '2rem',
            cursor: 'pointer', color: '#555'
          }}>&times;</button>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#495057', color: 'white' }}>
              <tr>
                {[
                  'Date', 'Client Name', 'Contact', 'Project',
                  'Location', 'Invoice No', 'Quoted',
                  'Final', 'Material', 'Labour', 'TA', 'Profit', 'Action'
                ].map(h => (
                  <th key={h} style={{
                    border: '1px solid #343a40', padding: '12px',
                    textAlign: 'left', fontSize: '0.85rem', whiteSpace: 'nowrap'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  {Object.keys(initialEmptyRow).map(field => (
                    <td key={field} style={{ border: '1px solid #ced4da', padding: '5px' }}>
                      <input
                        type={field === 'date' ? 'date' : 'text'}
                        value={row[field]}
                        onChange={(e) => handleChange(idx, field, e.target.value)}
                        required={field === 'clientName' || field === 'contact'}
                        style={{
                          width: '100%', minWidth: '100px',
                          border: '1px solid #ccc', borderRadius: '4px',
                          padding: '8px', fontSize: '0.9rem',
                          color: '#212529', background: '#fff'
                        }}
                      />
                    </td>
                  ))}

                  <td style={{
                    border: '1px solid #ced4da', padding: '5px',
                    whiteSpace: 'nowrap'
                  }}>
                    <input
                      readOnly
                      value={calculateProfit(row)
                        .toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      style={{
                        width: '100%', border: 'none', background: 'transparent',
                        color: '#155724', fontSize: '0.9rem', fontWeight: 'bold'
                      }}
                    />
                  </td>

                  <td style={{ border: '1px solid #ced4da', padding: '5px' }}>
                    {mode === 'add' && (
                      <button onClick={() => removeRow(idx)} style={{
                        backgroundColor: '#dc3545', color: 'white',
                        border: 'none', borderRadius: '4px',
                        padding: '6px 10px', cursor: 'pointer'
                      }}>Del</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: '1rem', marginTop: '1.5rem'
        }}>
          {mode === 'add' && (
            <button onClick={addRow} style={{
              backgroundColor: '#007bff', color: 'white',
              border: 'none', padding: '10px 15px',
              borderRadius: '5px', cursor: 'pointer'
            }}>+ Add Row</button>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {mode === 'add' ? (
              <>
                <button onClick={() => handleSave('Upcoming')} style={{ backgroundColor: '#ffc107', color: 'black', fontWeight: 'bold', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>Save to Upcoming</button>
                <button onClick={() => handleSave('Ongoing')} style={{ backgroundColor: '#17a2b8', color: 'white', fontWeight: 'bold', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>Save to Ongoing</button>
                <button onClick={() => handleSave('Completed')} style={{ backgroundColor: '#28a745', color: 'white', fontWeight: 'bold', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>Mark as Completed</button>
              </>
            ) : (
              <>
                <button onClick={() => handleSave()} style={{ backgroundColor: '#007bff', color: 'white', fontWeight: 'bold', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>Update Details</button>

                {initialStatus === 'Upcoming' && (
                  <button onClick={() => handleSave('Ongoing')} style={{ backgroundColor: '#17a2b8', color: 'white', fontWeight: 'bold', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                    Save to Ongoing
                  </button>
                )}

                <button onClick={() => handleSave('Completed')} style={{ backgroundColor: '#28a745', color: 'white', fontWeight: 'bold', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>Mark as Completed</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}