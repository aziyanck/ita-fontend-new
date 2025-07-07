import React, { useState, useEffect } from 'react';

export default function AddProject({ onSave, onClose, mode, projectToEdit }) {
  
  const initialEmptyRow = { date: '', clientName: '', contact: '', project: '', location: '', invoiceNo: '', quotedValue: '', finalValue: '', matExpenses: '', labour: '', ta: '' };
  
  const [rows, setRows] = useState([initialEmptyRow]);

  useEffect(() => {
    if (mode === 'edit' && projectToEdit) {
      setRows([projectToEdit]);
    } else {
      setRows([initialEmptyRow]);
    }
  }, [mode, projectToEdit]);


  const addRow = () => {
    setRows([...rows, initialEmptyRow]);
  };

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
      const updatedProject = { ...rows[0], status: status || rows[0].status };
      onSave(updatedProject);
    } else {
      const validRows = rows.filter(row => row.project && row.project.trim() !== '');
      if (validRows.length > 0) {
        onSave({ projects: validRows, status: status });
      } else {
        alert("Please enter details for at least one project.");
      }
    }
  };

  const backdropStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 };
  const contentStyle = { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '95%', maxWidth: '1400px', maxHeight: '90vh', overflowY: 'auto' };
  const actionsStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' };
  const saveButtonsContainer = { display: 'flex', gap: '0.5rem' };

  return (
    <div style={backdropStyle}>
      <div style={contentStyle}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#333'}}>
                {mode === 'edit' ? 'Edit Project' : 'Add New Projects'}
            </h2>
            <button onClick={onClose} style={{background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#555'}}>&times;</button>
        </div>
        
        <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
            <thead style={{backgroundColor: '#495057', color: 'white'}}>
                <tr>
                    {['Date', 'Client Name', 'Contact', 'Project', 'Location', 'Invoice No', 'Quoted', 'Final', 'Material', 'Labour', 'TA', 'Profit', 'Action'].map(header => (
                        <th key={header} style={{border: '1px solid #343a40', padding: '12px', textAlign: 'left', fontSize: '0.85rem', whiteSpace: 'nowrap'}}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        {Object.keys(initialEmptyRow).map(field => (
                            <td key={field} style={{border: '1px solid #ced4da', padding: '5px'}}>
                                <input 
                                    type={field === 'date' ? 'date' : 'text'}
                                    value={row[field]}
                                    onChange={(e) => handleChange(index, field, e.target.value)}
                                    style={{ width: '100%', minWidth: '100px', border: '1px solid #ccc', borderRadius: '4px', padding: '8px', fontSize: '0.9rem', color: '#212529' }}
                                />
                            </td>
                        ))}
                        <td style={{border: '1px solid #ced4da', padding: '10px', fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '0.9rem'}}>
                            {calculateProfit(row).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{border: '1px solid #ced4da', padding: '5px'}}>
                            {mode === 'add' && (
                                <button onClick={() => removeRow(index)} style={{backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer'}}>
                                    Del
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
        
        <div style={actionsStyle}>
          <div>
            {mode === 'add' && (
              <button onClick={addRow} style={{backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer'}}>
                  + Add Row
              </button>
            )}
          </div>
          <div style={saveButtonsContainer}>
            {mode === 'add' ? (
              <>
                <button onClick={() => handleSave('Upcoming')} style={{backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}>
                  Save to Upcoming
                </button>
                <button onClick={() => handleSave('Ongoing')} style={{backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}>
                  Save to Ongoing
                </button>
                <button onClick={() => handleSave('Completed')} style={{backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}>
                 Mark as Completed
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleSave()} style={{backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}>
                  Update Details
                </button>
                <button onClick={() => handleSave('Completed')} style={{backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}>
                  Mark as Completed
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}