import React, { useState } from 'react';
// Make sure to install lucide-react: npm install lucide-react
import { LayoutDashboard, Users, ShoppingCart, Settings, Menu, X , Newspaper } from 'lucide-react';

import Dashboard from './admin_components/Dashbord'
import GenerateQuotation from './admin_components/GenerateQuotation'

// --- Placeholder Components for Main Content ---
// These components would typically be in their own files.


const UsersManagement = () => (
    <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <p className="mt-2 text-gray-600">Manage all registered users.</p>
        {/* You would map over user data and render a table or list here */}
        <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-700">User list would appear here.</p>
        </div>
    </div>
);

const ProductsManagement = () => (
    <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <p className="mt-2 text-gray-600">Add, edit, and remove products.</p>
        <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
             <p className="text-gray-700">Product management interface would appear here.</p>
        </div>
    </div>
);

const SettingsP = () => (
    <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="mt-2 text-gray-600">Configure your application settings.</p>
         <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
             <p className="text-gray-700">Settings form would appear here.</p>
        </div>
    </div>
);


// --- Main Layout Components ---

const Sidebar = ({ activeComponent, setActiveComponent, isOpen, setIsOpen }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, component: 'Dashboard' },
        { name: 'Users', icon: Users, component: 'Users' },
        { name: 'Products', icon: ShoppingCart, component: 'Products' },
        { name: 'Settings', icon: Settings, component: 'Settings' },
        { name: 'Generate Quotation', icon: Newspaper, component: 'Generate Quotation' }
    ];

    return (
        <aside className={`bg-gray-800 text-white fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-30`}>
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <button onClick={() => setIsOpen(false)} className="md:hidden text-white">
                    <X size={24} />
                </button>
            </div>
            <nav>
                <ul>
                    {navItems.map(item => (
                        <li key={item.name} className="px-4">
                            <button
                                onClick={() => {
                                  setActiveComponent(item.component)
                                  if (isOpen) setIsOpen(false); // Close sidebar on mobile after click
                                }}
                                className={`w-full flex items-center p-3 my-2 rounded-lg transition-colors duration-200 ${
                                    activeComponent === item.component
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-700'
                                }`}
                            >
                                <item.icon className="mr-3" size={20} />
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

const Navbar = ({ setIsOpen }) => (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-20">
        <button onClick={() => setIsOpen(true)} className="md:hidden text-gray-600">
            <Menu size={24} />
        </button>
        <div className="text-xl font-semibold text-gray-800 hidden md:block">Dashboard</div>
        <div className="flex items-center">
            {/* Placeholder for user profile */}
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
    </header>
);

const MainContent = ({ activeComponent }) => {
    const renderComponent = () => {
        switch (activeComponent) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Users':
                return <UsersManagement />;
            case 'Products':
                return <ProductsManagement />;
            case 'Settings':
                return <SettingsP />;
            case 'Generate Quotation':
                return <GenerateQuotation />;
            default:
                return <Dashboard />;
        }
    };
    return <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">{renderComponent()}</main>;
};

// --- The Main App Component ---

export default function Admin() {
    const [activeComponent, setActiveComponent] = useState('Dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen flex bg-gray-100 font-sans">
            <Sidebar
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
            />
            {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
            <div className="flex-1 flex flex-col h-screen">
                <Navbar setIsOpen={setSidebarOpen} />
                <MainContent activeComponent={activeComponent} />
            </div>
        </div>
    );
}
