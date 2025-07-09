import React, { useState, useEffect } from 'react';
import { Mail, Lock, Trash2 } from 'lucide-react';
import { registerUser, registerAdmin, getAllUsers, deleteUser } from './supabaseServices';
import Loader from "../components/animations/Loader"


// Card components are defined here to avoid import issues
const Card = ({ children, className }) => (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className }) => (
    <div className={`p-4 sm:p-6 border-b border-gray-200 ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className }) => (
    <div className={`p-4 sm:p-6 ${className}`}>
        {children}
    </div>
);

const UserManagement = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await getAllUsers();
            console.log("called getAllUsers", fetchedUsers)
            setUsers(fetchedUsers);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to fetch users.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRegisterUser = async (e) => {
        e.preventDefault();
        try {
            await registerUser(email, password, name);
            setSuccess('User registered successfully!');
            setError('');
            setName('');
            setEmail('');
            setPassword('');
            fetchUsers(); // Refresh user list
        } catch (err) {
            setError(err.message);
            setSuccess('');
        }
    };

    const handleRegisterAdmin = async (e) => {
        e.preventDefault();
        try {
            await registerAdmin(email, password, name);
            setSuccess('Admin registered successfully!');
            setError('');
            setName('');
            setEmail('');
            setPassword('');
            fetchUsers(); // Refresh user list
        } catch (err) {
            setError(err.message);
            setSuccess('');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(userId);
                setSuccess('User deleted successfully!');
                setError('');
                fetchUsers(); // Refresh user list
            } catch (err) {
                setError(err.message);
                setSuccess('');
            }
        }
    };

    return (
        <div className='flex w-full justify-center items-center '>
            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Existing Users</h2>
                        <p className="text-sm text-gray-500">Manage registered users.</p>
                    </CardHeader>
                    <CardContent>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {users.length === 0 && (
                            <div className="scale-70 mt-6">
                                <Loader />
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Add New User</h2>
                        <p className="text-sm text-gray-500">Register new users or admins.</p>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            {/* Name Input */}
                            <div className="relative">
                                <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400">
                                    <Mail size={20} /> {/* Using Mail icon for name, can be changed */}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full text-lt placeholder-gray-400 border border-gray-600 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                    required
                                />
                            </div>
                            {/* Email Input */}
                            <div className="relative">
                                <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full text-lt placeholder-gray-400 border border-gray-600 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full text-lt placeholder-gray-400 border border-gray-600 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                    required
                                />
                            </div>

                            {/* Error and Success Messages */}
                            {error && (
                                <div className="text-red-400 text-sm text-center">{error}</div>
                            )}
                            {success && (
                                <div className="text-green-400 text-sm text-center">
                                    {success}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-between space-x-4">
                                <button
                                    type="button"
                                    onClick={handleRegisterUser}
                                    className="w-1/2 bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    Add User
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRegisterAdmin}
                                    className="w-1/2 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50 transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    Add Admin
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>


            </div>
        </div>
    );
};

export default UserManagement;