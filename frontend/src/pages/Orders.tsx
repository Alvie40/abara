import { useGetUserOrdersQuery } from '../store/api/ordersApi'
import { Order } from '../types'

const Orders = () => {
  const { data: orders = [], isLoading, error } = useGetUserOrdersQuery()

  if (isLoading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">Error loading orders</div>
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">No orders found</h2>
        <p className="text-gray-600 mt-2">You haven't placed any orders yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Your Orders</h2>
      {orders.map((order: Order) => (
        <div key={order.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">Order #{order.id}</h3>
              <p className="text-gray-600">{new Date(order.created_at!).toLocaleDateString()}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              ${order.total_price.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Shipping Details</h4>
                <p className="text-gray-600">{order.name}</p>
                <p className="text-gray-600">{order.email}</p>
                <p className="text-gray-600">{order.phone}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <p className="text-gray-600">
                  {order.address.city}, {order.address.state}
                </p>
                <p className="text-gray-600">
                  {order.address.country}, {order.address.zipcode}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Orders