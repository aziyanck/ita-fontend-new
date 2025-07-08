import React, { useEffect, useState } from 'react';
import { getMonthlyProfitsByFY } from './supabaseServices';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const currentYear = new Date().getFullYear();
const currentFY = new Date().getMonth() < 3 ? currentYear - 1 : currentYear;
const monthOrder = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const ProfitPopup = ({ onClose }) => {
    const [year, setYear] = useState(currentFY);
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    // Fetch full year data when year changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getMonthlyProfitsByFY(year);
                setData(result);
                setFiltered(result);
            } catch (err) {
                console.error('Error loading FY profits:', err);
                setData([]);
                setFiltered([]);
            }
        };
        fetchData();
    }, [year]);

    // Re-filter whenever start or end changes
    useEffect(() => {
        if (!start && !end) {
            setFiltered(data);
            return;
        }
        const filteredData = data.filter(d => {
            const index = monthOrder.indexOf(d.month);
            const afterStart = start ? index >= monthOrder.indexOf(start) : true;
            const beforeEnd = end ? index <= monthOrder.indexOf(end) : true;
            return afterStart && beforeEnd;
        });
        setFiltered(filteredData);
    }, [start, end, data]);

    const resetFilters = () => {
        setStart('');
        setEnd('');
        setYear(currentFY);
    };

    const downloadExcel = () => {
        const exportData = filtered.map((d, i) => ({
            'Sl No': i + 1,
            'Month': d.month,
            'Profit': d.profit
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `FY ${year}-${year + 1}`);
        const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `monthly_profit_FY_${year}_${year + 1}.xlsx`);
    };

    const generateYearOptions = () => {
        const years = [];
        for (let y = currentFY; y >= 2018; y--) {
            years.push(y);
        }
        return years;
    };


    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-xl max-h-[90vh] overflow-y-auto relative">
                <button className="absolute top-2 right-4 text-xl text-gray-500" onClick={onClose}>✖</button>
                <h2 className="text-xl font-bold mb-4">Profit (FY {year}-{year + 1})</h2>

                <div className="flex flex-wrap gap-3 mb-4 items-center">
                    <label className="text-sm font-medium">Select FY:
                        <select className="ml-2 border px-2 py-1" value={year} onChange={e => setYear(parseInt(e.target.value))}>
                            {generateYearOptions().map(y => (
                                <option key={y} value={y}>{`${y}-${y + 1}`}</option>
                            ))}
                        </select>
                    </label>

                    <label className="text-sm font-medium">Start:
                        <select className="ml-2 border px-2 py-1" value={start} onChange={e => setStart(e.target.value)}>
                            <option value="">--</option>
                            {monthOrder.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </label>

                    <label className="text-sm font-medium">End:
                        <select className="ml-2 border px-2 py-1" value={end} onChange={e => setEnd(e.target.value)}>
                            <option value="">--</option>
                            {monthOrder.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </label>

                    <button onClick={resetFilters} className="bg-red-500 text-white px-4 py-1 rounded">Clear</button>
                    <button onClick={downloadExcel} className="bg-blue-500 text-white px-4 py-1 rounded">Download Excel</button>
                </div>

                <table className="w-full border text-left text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-3 py-2">#</th>
                            <th className="px-3 py-2">Month</th>
                            <th className="px-3 py-2">Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((d, i) => (
                            <tr key={i} className="border-t">
                                <td className="px-3 py-1">{i + 1}</td>
                                <td className="px-3 py-1">{d.month}</td>
                                <td className="px-3 py-1">₹{d.profit.toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProfitPopup;
