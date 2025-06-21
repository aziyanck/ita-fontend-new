export default function Dashboard() {
    return (
        <div className="">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to your admin dashboard.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">$12,345</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">New Users</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">150</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Orders Pending</h3>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">32</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Products</h3>
                    <p className="text-2xl font-bold text-indigo-600 mt-2">78</p>
                </div>
            </div>
        </div>
    )

}