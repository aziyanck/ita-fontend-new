// projects.jsx
import React, { useState } from 'react';
import AddProject from './sub_admins/AddProjects'; // Make sure the path is correct based on your file structure

const Projects = () => {
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const handleAddProjectClick = () => {
    setShowAddProjectModal(true);
  };

  const handleCloseModal = () => {
    setShowAddProjectModal(false);
  };

  // Placeholder for project cards
  const projectCards = Array(6).fill(0).map((_, index) => (
    <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-center h-32 text-gray-500 text-lg font-semibold">
      Project Card {index + 1}
    </div>
  ));

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-6xl  mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Projects</h1>
          <button
            onClick={handleAddProjectClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projectCards}
        </div>
      </div>

      {/* Conditionally render the AddProject modal */}
      {showAddProjectModal && <AddProject onClose={handleCloseModal} />}
    </div>
  );
};

export default Projects;