import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "./admin_components/supabaseClient"
import { getAllUsers, getUser } from "./admin_components/supabaseServices"
// Make sure to install lucide-react: npm install lucide-react

import Dashboard from "./admin_components/Dashbord"
import GenerateQuotation from "./admin_components/GenerateQuotation"
import Products from "./admin_components/Products"
import InvoiceGenerator from "./admin_components/InvoiceManager"
import Projects from "./admin_components/Projects"
import UserManagement from "./admin_components/UserManagement"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  UserCog,
  Menu,
  X,
  HouseWifi,
  Newspaper,
} from "lucide-react"
import Clients from "./admin_components/Clients"

const Sidebar = ({
  activeComponent,
  setActiveComponent,
  isOpen,
  setIsOpen,
  userRole,
}) => {
  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      component: "Dashboard",
      adminOnly: true,
    },
    {
      name: "Generate Quotation",
      icon: Newspaper,
      component: "Generate Quotation",
      adminOnly: false,
    },
    {
      name: "Products",
      icon: ShoppingCart,
      component: "Products",
      adminOnly: false,
    },
    {
      name: "Generate Invoice",
      icon: Newspaper,
      component: "Generate Invoice",
      adminOnly: false,
    },
    {
      name: "Projects",
      icon: HouseWifi,
      component: "Projects",
      adminOnly: true,
    },
    { name: "Clients", icon: Users, component: "Clients", adminOnly: true },
    {
      name: "User Management",
      icon: UserCog,
      component: "User Management",
      adminOnly: true,
    },
  ]

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || userRole === "admin",
  )

  return (
    <aside
      className={`bg-gray-800 text-white h-auto fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-30 pt-20 md:pt-0`}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-white"
        >
          <X size={24} />
        </button>
      </div>
      <nav>
        <ul>
          {filteredNavItems.map((item) => (
            <li key={item.name} className="px-4">
              <button
                onClick={() => {
                  setActiveComponent(item.component)
                  if (isOpen) setIsOpen(false) // Close sidebar on mobile after click
                }}
                className={`w-full flex items-center p-3 my-2 rounded-lg transition-colors duration-200 ${
                  activeComponent === item.component
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700"
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
  )
}

const Navbar = ({ setIsOpen }) => {
  const [showLogoutBox, setShowLogoutBox] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const fetchUserName = async () => {
      const user = await getUser()
      setUserName(user?.app_metadata?.name || "User")
    }
    fetchUserName()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login" // or navigate("/login");
  }

  return (
    <header className="bg-white shadow-md px-6 py-4 fixed top-0 left-0 w-full md:left-64 md:w-[calc(100%-16rem)] flex justify-between items-center z-50">
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden text-gray-600"
      >
        <Menu size={24} />
      </button>

      <div className="text-xl font-semibold text-gray-800 hidden md:block">
        Dashboard
      </div>

      {/* Profile + Popup */}
      <div className="relative">
        <div
          className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer"
          onClick={() => setShowLogoutBox(!showLogoutBox)}
        ></div>

        {showLogoutBox && (
          <div className="absolute right-0 mt-2 bg-white shadow-md rounded border px-4 py-2 z-50 w-40 ">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {userName}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline hover:cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

const MainContent = ({ activeComponent }) => {
  const renderComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Dashboard />
      case "Generate Quotation":
        return <GenerateQuotation />
      case "Products":
        return <Products />
      case "Generate Invoice":
        return <InvoiceGenerator />
      case "Projects":
        return <Projects />
      case "Clients":
        return <Clients />
      case "User Management":
        return <UserManagement />
      default:
        return <Dashboard />
    }
  }
  return <main className="flex h-auto ">{renderComponent()}</main>
}

// --- The Main App Component ---

export default function Admin() {
  const [activeComponent, setActiveComponent] = useState(
    () => localStorage.getItem("activeComponent") || null,
  )

  useEffect(() => {
    getAllUsers()
  }, [])

  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (activeComponent) {
      localStorage.setItem("activeComponent", activeComponent)
    }
  }, [activeComponent])

  useEffect(() => {
    const handleUserSession = async (session) => {
      if (!session) {
        localStorage.removeItem("activeComponent")
        navigate("/login")
        return
      }

      const user = await getUser()
      const role = user?.app_metadata?.role || "employee"
      setUserRole(role)

      const storedComponent = localStorage.getItem("activeComponent")

      if (!storedComponent) {
        // Only set default if no value is in localStorage
        const defaultComponent = role === "admin" ? "Dashboard" : "Products"
        setActiveComponent(defaultComponent)
        localStorage.setItem("activeComponent", defaultComponent)
      } else {
        // Make sure state is synced with localStorage
        setActiveComponent(storedComponent)
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleUserSession(session)
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="h-screen min-h-screen w-screen flex bg-gray-100 font-sans">
      <Sidebar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        userRole={userRole}
      />
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-y-scroll h-auto pt-[4.5rem] pl-0">
        <Navbar setIsOpen={setSidebarOpen} />
        {activeComponent && <MainContent activeComponent={activeComponent} />}
      </div>
    </div>
  )
}
