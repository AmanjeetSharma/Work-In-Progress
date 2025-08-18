const AnalyticsPanel = () => {
    const stats = {
        totalSales: 12543.21,
        monthlySales: 3245.67,
        totalProducts: 5,
        totalUsers: 4,
    };

    const products = [
        { id: 1, name: 'Premium Headphones', price: 199.99, stock: 45, category: 'Electronics', sales: 128 },
        { id: 2, name: 'Wireless Keyboard', price: 89.99, stock: 32, category: 'Electronics', sales: 76 },
        { id: 3, name: 'Yoga Mat', price: 29.99, stock: 87, category: 'Fitness', sales: 215 },
        { id: 4, name: 'Smart Watch', price: 249.99, stock: 18, category: 'Electronics', sales: 92 },
        { id: 5, name: 'Water Bottle', price: 19.99, stock: 124, category: 'Fitness', sales: 342 },
    ];

    const orders = [
        { id: 1001, customer: 'John Doe', date: '2023-05-15', total: 289.98, status: 'Shipped' },
        { id: 1002, customer: 'Jane Smith', date: '2023-05-16', total: 119.98, status: 'Processing' },
        { id: 1003, customer: 'Robert Johnson', date: '2023-05-17', total: 249.99, status: 'Delivered' },
        { id: 1004, customer: 'Emily Davis', date: '2023-05-18', total: 79.98, status: 'Processing' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-500">Total Sales</h3>
                    <p className="text-3xl font-bold mt-2">${stats.totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-500">Monthly Sales</h3>
                    <p className="text-3xl font-bold mt-2">${stats.monthlySales.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-500">Total Products</h3>
                    <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-500">Total Users</h3>
                    <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Sales Overview</h3>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">Sales chart would appear here</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
                    <div className="space-y-4">
                        {[...products].sort((a, b) => b.sales - a.sales).slice(0, 3).map((product) => (
                            <div key={product.id} className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                                <div className="flex-1">
                                    <h4 className="font-medium">{product.name}</h4>
                                    <p className="text-sm text-gray-500">{product.sales} sold</p>
                                </div>
                                <span className="font-bold">${product.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                            <div key={order.id} className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium">Order #{order.id}</h4>
                                    <p className="text-sm text-gray-500">{order.customer}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full 
                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPanel;