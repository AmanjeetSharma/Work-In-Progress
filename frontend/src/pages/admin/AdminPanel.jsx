import { useState } from 'react';
import { FaBox, FaUsers, FaChartLine, FaCog } from 'react-icons/fa';
import ProductsPanel from './ProductsPanel';
import OrdersPanel from './OrdersPanel';
import UsersPanel from './UsersPanel';
import AnalyticsPanel from './AnalyticsPanel';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('products');

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductsPanel />;
            case 'orders':
                return <OrdersPanel />;
            case 'users':
                return <UsersPanel />;
            case 'analytics':
                return <AnalyticsPanel />;
            default:
                return <ProductsPanel />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-950">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white">
                <div className="p-4 border-b border-gray-700">
                    <h1 className="text-xl font-bold pt-20">Admin Dashboard</h1>
                    <p className="text-sm text-gray-400">Welcome back, Admin</p>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'products' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaBox className="mr-3" />
                                Products
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'orders' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaBox className="mr-3" />
                                Orders
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaUsers className="mr-3" />
                                Users
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'analytics' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaChartLine className="mr-3" />
                                Analytics
                            </button>
                        </li>
                        <li>
                            <button
                                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700"
                            >
                                <FaCog className="mr-3" />
                                Settings
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto pt-20">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPanel;