import React, { useEffect, useState } from 'react';
import { getAllClientsWithProjects } from './supabaseServices';
import SalesInvoiceDetail from './sub_admins/SalesInvoiceDetail';
import { supabase } from './supabaseClient'

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const result = await getAllClientsWithProjects();
        setClients(result);
        setFilteredClients(result);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        setClients([]);
        setFilteredClients([]);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [search, clients]);

  const closeDetails = () => setSelectedClient(null);
  const closeInvoice = () => setSelectedInvoice(null);



  const handleDeleteClient = async (client) => {
    if (client.projects && client.projects.length > 0) {
      alert("Cannot delete a client who has projects.");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ${client.name}?`);
    if (!confirmDelete) return;

    const { error } = await supabase.from("clients").delete().eq("id", client.id);
    if (error) {
      console.error("Error deleting client:", error.message);
      alert("Failed to delete client.");
      return;
    }

    // Remove deleted client from local state
    const updatedClients = clients.filter(c => c.id !== client.id);
    setClients(updatedClients);
    setFilteredClients(updatedClients);
  };


  const getClientTotalProfit = (projects = []) =>
    projects.reduce((sum, p) => sum + (p.profit || 0), 0);

  return (
    <div className="p-6 w-full max-w-screen text-gray-950">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold">All Clients</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-1 rounded text-sm w-full sm:w-auto"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {filteredClients.map(client => (
          <div
            key={client.id}
            className="p-4 bg-white rounded-xl shadow hover:bg-gray-50 relative"
          >
            <div
              className="cursor-pointer"
              onClick={() => setSelectedClient(client)}
            >
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <p className="text-sm text-gray-500">{client.phone}</p>
              <p className="text-sm text-gray-600">{client.projects?.length || 0} projects</p>
              <p className="text-sm text-green-600 font-medium">
                ₹{getClientTotalProfit(client.projects).toLocaleString('en-IN')} total profit
              </p>
            </div>

            {client.projects?.length === 0 && (
              <button
                onClick={() => handleDeleteClient(client)}
                className="absolute top-2 right-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
              >
                Delete
              </button>
            )}
          </div>

        ))}
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh] relative">
            <button className="absolute top-2 right-4 text-xl text-gray-600" onClick={closeDetails}>✖</button>
            <h3 className="text-2xl font-bold mb-2">{selectedClient.name}</h3>
            <p className="mb-2 text-gray-500">Phone: {selectedClient.phone}</p>
            <p className="mb-4 text-green-700 font-semibold">
              Total Profit: ₹{getClientTotalProfit(selectedClient.projects).toLocaleString('en-IN')}
            </p>

            <table className="w-full border text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Invoice No</th>
                  <th className="px-3 py-2">Project Name</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Profit</th>
                </tr>
              </thead>
              <tbody>
                {selectedClient.projects?.map((proj, index) => (
                  <tr key={proj.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => proj.invoice_no && setSelectedInvoice(proj.invoice_no)}>
                    <td className="px-3 py-1">{index + 1}</td>
                    <td className="px-3 py-1 text-blue-600 ">{proj.invoice_no || '—'}</td>
                    <td className="px-3 py-1">{proj.project_name}</td>
                    <td className="px-3 py-1">{new Date(proj.project_date).toLocaleDateString()}</td>
                    <td className="px-3 py-1">{proj.status}</td>
                    <td className="px-3 py-1">{proj.location}</td>
                    <td className="px-3 py-1">₹{proj.profit?.toLocaleString('en-IN') || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <SalesInvoiceDetail invoiceNo={selectedInvoice} onClose={closeInvoice} />
      )}
    </div>
  );
};

export default Clients;
