import React, { useState, useMemo } from 'react';


import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';




const DataView = ({ title, data, onClose }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    const toggleFilter = () => setShowFilter((prev) => !prev);

    const applyFilter = () => {
        if (!startDate && !endDate) {
            setFilteredData(data); // reset to full data if no dates selected
            return;
        }

        const filtered = data.filter((project) => {
            const projectTime = new Date(project.project_date).getTime();

            const afterStart =
                startDate !== ''
                    ? projectTime >= new Date(startDate).getTime()
                    : true;

            const beforeEnd =
                endDate !== ''
                    ? projectTime <= new Date(endDate).getTime()
                    : true;

            return afterStart && beforeEnd;
        });

        setFilteredData(filtered);
    };

    // Reset filtered data when DataView receives new data
    React.useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const downloadExcel = () => {
        const exportData = filteredData.map((project, index) => ({
            'Sl No': index + 1,
            'Project Name': project.project_name,
            'Client Name': project.clients?.name || '',
            'Contact': project.clients?.phone || '',
            'Location': project.location,
            'Project Date': new Date(project.project_date).toLocaleDateString(),
            'Invoice No': project.invoice_no,
            'Quoted Value': project.quoted_value,
            'Final Value': project.final_value,
            'Material Expenses': project.material_expenses,
            'Labour Cost': project.labour_cost,
            'TA Cost': project.ta_cost,
            'Status': project.status,
            'Profit': project.profit,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataBlob, 'projects.xlsx');
    };
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-full p-6 overflow-y-auto max-h-[90vh] relative">
                <button
                    onClick={onClose}
                    className="absolute top-1 right-4 text-gray-500 text-xl hover:text-gray-700"
                >
                    ✖
                </button>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{title}</h2>


                </div>

                <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center">
                    <button
                        onClick={() => downloadExcel()}
                        className="bg-blue-500 text-white rounded px-4 py-1 text-sm hover:bg-blue-600"
                    >
                        Download Excel
                    </button>

                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="bg-gray-500 text-white rounded px-4 py-1 text-sm hover:bg-gray-600"
                    >
                        {showFilter ? 'Hide Filter' : 'Filter'}
                    </button>

                    {showFilter && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <label className="text-sm font-medium">
                                Start Date:
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                            </label>
                            <label className="text-sm font-medium">
                                End Date:
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                            </label>
                            <button
                                onClick={applyFilter}
                                className="bg-green-500 text-white rounded px-4 py-1 text-sm hover:bg-green-600"
                            >
                                Apply
                            </button>
                            <button
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                    setFilteredData(data); // reset to full data
                                }}
                                className="bg-red-500 text-white rounded px-4 py-1 text-sm hover:bg-red-600"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>



                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 font-medium">SL No</th>
                                <th className="px-4 py-2 font-medium">Project Name</th>
                                <th className="px-4 py-2 font-medium">Client</th>
                                <th className="px-4 py-2 font-medium">Contact</th>
                                <th className="px-4 py-2 font-medium">Location</th>
                                <th className="px-4 py-2 font-medium">Project Date</th>
                                <th className="px-4 py-2 font-medium">Invoice No</th>
                                <th className="px-4 py-2 font-medium">Quoted Value</th>
                                <th className="px-4 py-2 font-medium">Final Value</th>
                                <th className="px-4 py-2 font-medium">Material Expenses</th>
                                <th className="px-4 py-2 font-medium">Labour Cost</th>
                                <th className="px-4 py-2 font-medium">TA Cost</th>
                                <th className="px-4 py-2 font-medium">Status</th>
                                <th className="px-4 py-2 font-medium">Profit</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-4 text-center text-gray-500" colSpan={14}>
                                        No projects match the selected date range.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((project, index) => (
                                    <tr key={project.id}>
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{project.project_name}</td>
                                        <td>{project.clients?.name || '-'}</td>
                                        <td>{project.clients?.phone || '-'}</td>

                                        <td className="px-4 py-2">{project.location}</td>
                                        <td className="px-4 py-2">
                                            {project.project_date
                                                ? new Date(project.project_date).toLocaleDateString()
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-2">{project.invoice_no}</td>
                                        <td className="px-4 py-2">
                                            {project.quoted_value != null
                                                ? `₹${project.quoted_value.toLocaleString('en-IN')}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {project.final_value != null
                                                ? `₹${project.final_value.toLocaleString('en-IN')}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {project.material_expenses != null
                                                ? `₹${project.material_expenses.toLocaleString('en-IN')}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {project.labour_cost != null
                                                ? `₹${project.labour_cost.toLocaleString('en-IN')}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {project.ta_cost != null
                                                ? `₹${project.ta_cost.toLocaleString('en-IN')}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-2">{project.status}</td>
                                        <td className="px-4 py-2">
                                            {project.profit != null
                                                ? `₹${project.profit.toLocaleString('en-IN')}`
                                                : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataView;
