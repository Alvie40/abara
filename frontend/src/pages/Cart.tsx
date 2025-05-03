import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../store'
import { removeFromCart, updateQuantity } from '../store/reducers/cartSlice'
import { TrashIcon } from '@heroicons/react/24/outline'

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch()

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link
          to="/books"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-6 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
        <div className="mt-8">
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.id} className="py-6 flex">
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                      <p className="ml-4 text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value) }))
                        }
                        className="rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="ml-4 text-red-600 hover:text-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${cart.total.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">Shipping calculated at checkout.</p>
        <div className="mt-6">
          <Link
            to="/checkout"
            className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Checkout
          </Link>
        </div>
        <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
          <p>
            or{' '}
            <Link to="/books" className="text-blue-600 font-medium hover:text-blue-500">
              Continue Shopping<span aria-hidden="true"> &rarr;</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Cart