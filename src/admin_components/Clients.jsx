import React, { useEffect, useState } from 'react';
import { getAllClientsWithProjects } from './supabaseServices';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState('');

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

  const getClientTotalProfit = (projects = []) =>
    projects.reduce((sum, p) => sum + (p.profit || 0), 0);

  return (
    <div className="p-6 max-w-screen text-gray-950">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">All Clients</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border  py-1 rounded text-sm"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {filteredClients.map(client => (
          <div
            key={client.id}
            className="px-4 py-4 bg-white rounded-xl shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedClient(client)}
          >
            <h3 className="text-lg font-semibold">{client.name}</h3>
            <p className="text-sm text-gray-500">{client.phone}</p>
            <p className="text-sm text-gray-600">{client.projects?.length || 0} projects</p>
            <p className="text-sm text-green-600 font-medium">
              ₹{getClientTotalProfit(client.projects).toLocaleString('en-IN')} total profit
            </p>
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
                  <th className="px-3 py-2">Project Name</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Profit</th>
                </tr>
              </thead>
              <tbody>
                {selectedClient.projects?.map((proj, index) => (
                  <tr key={proj.id} className="border-t">
                    <td className="px-3 py-1">{index + 1}</td>
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
    </div>
  );
};

export default Clients;
