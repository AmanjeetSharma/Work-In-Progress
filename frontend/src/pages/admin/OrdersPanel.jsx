const OrdersPanel = () => {
    const orders = [
        { id: 1001, customer: 'John Doe', date: '2023-05-15', total: 289.98, status: 'Shipped' },
        { id: 1002, customer: 'Jane Smith', date: '2023-05-16', total: 119.98, status: 'Processing' },
        { id: 1003, customer: 'Robert Johnson', date: '2023-05-17', total: 249.99, status: 'Delivered' },
        { id: 1004, customer: 'Emily Davis', date: '2023-05-18', total: 79.98, status: 'Processing' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Orders</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button className="text-blue-600 hover:text-blue-900">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersPanel;