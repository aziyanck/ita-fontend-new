import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './admin_components/supabaseClient';
import { getUser } from './admin_components/supabaseServices';
// Make sure to install lucide-react: npm install lucide-react
import { LayoutDashboard, Users, ShoppingCart, Settings, Menu, X, HouseWifi, Newspaper } from 'lucide-react';

import Dashboard from './admin_components/Dashbord'
import GenerateQuotation from './admin_components/GenerateQuotation'
import Products from './admin_components/Products'
import InvoiceGenerator from './admin_components/InvoiceManager'
import Projects from './admin_components/Projects'
import Clients from './admin_components/Clients'






const Sidebar = ({ activeComponent, setActiveComponent, isOpen, setIsOpen, userRole }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, component: 'Dashboard', adminOnly: true },
        { name: 'Generate Quotation', icon: Newspaper, component: 'Generate Quotation', adminOnly: false },
        { name: 'Products', icon: ShoppingCart, component: 'Products', adminOnly: false },
        { name: 'Generate Invoice', icon: Newspaper, component: 'Generate Invoice', adminOnly: false },
        { name: 'Projects', icon: HouseWifi, component: 'Projects', adminOnly: true },
        { name: 'Clients', icon: Users, component: 'Clients', adminOnly: true }
    ];

    const filteredNavItems = navItems.filter(item => !item.adminOnly || userRole === 'admin');

    return (
        <aside className={`bg-gray-800 text-white h-auto fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-30`}>
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <button onClick={() => setIsOpen(false)} className="md:hidden text-white">
                    <X size={24} />
                </button>
            </div>
            <nav>
                <ul>
                    {filteredNavItems.map(item => (
                        <li key={item.name} className="px-4">
                            <button
                                onClick={() => {
                                    setActiveComponent(item.component)
                                    if (isOpen) setIsOpen(false); // Close sidebar on mobile after click
                                }}
                                className={`w-full flex items-center p-3 my-2 rounded-lg transition-colors duration-200 ${activeComponent === item.component
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
    <header className="bg-white shadow-md p-4 w-screen md:w-auto flex justify-between items-center z-20">
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
            case 'Generate Quotation':
                return <GenerateQuotation />;
            case 'Products':
                return <Products />;
            case 'Generate Invoice':
                return <InvoiceGenerator />;
            case 'Projects':
                return <Projects />;
            case 'Clients':
                return <Clients />;
            default:
                return <Dashboard />;
        }
    };
    return <main className="flex h-auto ">{renderComponent()}</main>;
};

// --- The Main App Component ---

export default function Admin() {
    const [activeComponent, setActiveComponent] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSessionAndGetUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
            } else {
                const user = await getUser();
                const role = user?.user_metadata?.role || 'employee';
                setUserRole(role);
                if (role === 'admin') {
                    setActiveComponent('Dashboard');
                } else {
                    setActiveComponent('Products');
                }
            }
        };
        checkSessionAndGetUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/login');
            } else {
                getUser().then(user => {
                    const role = user?.user_metadata?.role || 'employee';
                    setUserRole(role);
                    if (role === 'admin') {
                        setActiveComponent('Dashboard');
                    } else {
                        setActiveComponent('Products');
                    }
                });
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    return (
        <div className="h-screen min-h-screen w-screen flex bg-gray-100 font-sans">
            <Sidebar
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
                userRole={userRole}
            />
            {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
            <div className="flex-1 flex flex-col overflow-y-scroll h-auto">
                <Navbar setIsOpen={setSidebarOpen} />
                {activeComponent && <MainContent activeComponent={activeComponent} />}
            </div>
        </div>
    );
}

