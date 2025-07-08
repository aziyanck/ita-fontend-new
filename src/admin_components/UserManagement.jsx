import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { registerUser, registerAdmin } from './supabaseServices';

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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegisterUser = async (e) => {
        e.preventDefault();
        try {
            await registerUser(email, password);
            setSuccess('User registered successfully!');
            setError('');
        } catch (error) {
            setError(error.message);
            setSuccess('');
        }
    };

    const handleRegisterAdmin = async (e) => {
        e.preventDefault();
        try {
            await registerAdmin(email, password);
            setSuccess('Admin registered successfully!');
            setError('');
        } catch (error) {
            setError(error.message);
            setSuccess('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <h2 className="text-xl font-semibold">User Management</h2>
                <p className="text-sm text-gray-500">Add new users or admins.</p>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
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
    );
};

export default UserManagement;