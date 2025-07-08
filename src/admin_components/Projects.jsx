import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import AddProject from './Addprojects';
import * as projectService from './sub_admins/projectService';

export default function Projects() {
  const [isAddProjectVisible, setIsAddProjectVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Upcoming');
  const [modalMode, setModalMode] = useState('add');
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const projects = await projectService.getProjects();
        setAllProjects(projects);
      } catch (error) {
        console.error("Failed to load projects. Supabase error:", error.message);
        console.error("Full error object:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleSave = async (data) => {
    try {
      if (modalMode === 'add') {
        const newProjects = await projectService.addProjects(data.projects, data.status);
        setAllProjects(prev => [...prev, ...newProjects]);
        setActiveFilter(data.status);
      } else {
        const updatedProject = await projectService.updateProject(data);
        setAllProjects(prev =>
          prev.map(p => (p.id === updatedProject.id ? updatedProject : p))
        );
        if (updatedProject.status === 'Completed') {
          setActiveFilter('Completed');
        }
      }
    } catch (error) {
      console.error("Failed to save project. Supabase error:", error.message);
      console.error("Full error object:", error);
    } finally {
      setIsAddProjectVisible(false);
      setProjectToEdit(null);
    }
  };

  const handleDelete = async (projectId, event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectService.deleteProject(projectId);
        setAllProjects(prev => prev.filter(p => p.id !== projectId));
      } catch (error) {
        console.error("Failed to delete project. Supabase error:", error.message);
        console.error("Full error object:", error);
      }
    }
  };

  const handleAddClick = () => {
    setModalMode('add');
    setProjectToEdit(null);
    setIsAddProjectVisible(true);
  };

  const handleEditClick = (project) => {
    setModalMode('edit');
    setProjectToEdit(project);
    setIsAddProjectVisible(true);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 w-full min-h-screen">
      <header className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Our Projects</h1>
            <p className="text-md text-gray-500">2025-2026</p>
          </div>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            + Add Project
          </button>
        </div>
        <img
          src="/ITA projects.png"
          alt="Team planning project"
          className="w-full h-48 object-cover rounded-md"
        />
      </header>

      <div className="flex justify-center border-b mb-6">
        {['Upcoming', 'Ongoing', 'Completed'].map(status => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`py-2 px-6 text-lg ${
              activeFilter === status
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {isAddProjectVisible && (
        <AddProject
          onSave={handleSave}
          onClose={() => setIsAddProjectVisible(false)}
          mode={modalMode}
          projectToEdit={projectToEdit}
          initialStatus={projectToEdit?.status ?? 'Upcoming'}  // ✅ NEW
        />
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading projects...</p>
      ) : (
        <div className="space-y-6">
          {allProjects
            .filter(p => p.status === activeFilter)
            .map(project => (
              <div
                key={project.id}
                onClick={() => handleEditClick(project)}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {project.project}
                    </h3>
                    <p className="text-gray-600">{project.clientName}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-right">
                      <span className="text-xs text-gray-500">Date</span>
                      <p className="text-gray-700">{project.date}</p>
                    </div>
                    <button
                      onClick={e => handleDelete(project.id, e)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoBox
                    label="Final Value"
                    value={project.finalValue}
                  />
                  <InfoBox
                    label="Material Cost"
                    value={project.matExpenses}
                  />
                  <InfoBox
                    label="Labour + TA"
                    value={(parseFloat(project.labour || 0) + parseFloat(project.ta || 0))}
                  />
                  <InfoBox
                    label="Profit"
                    value={project.profit}
                    isProfit={true}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

const InfoBox = ({ label, value, isProfit = false }) => {
  const formattedValue = `₹ ${parseFloat(value || 0).toLocaleString('en-IN')}`;
  return (
    <div
      className={`p-4 rounded-lg ${
        isProfit ? 'bg-green-50' : 'bg-gray-100'
      }`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`text-xl font-semibold ${
          isProfit ? 'text-green-600' : 'text-gray-800'
        }`}
      >
        {formattedValue}
      </p>
    </div>
  );
};