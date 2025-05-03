import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import { useAddOrderMutation } from '../store/api/ordersApi'
import { useAuth } from '../hooks/useAuth'
import Swal from 'sweetalert2'

interface CheckoutForm {
  name: string
  phone: string
  city: string
  state: string
  country: string
  zipcode: string
}

const Checkout = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>()
  const cart = useSelector((state: RootState) => state.cart)
  const { user } = useAuth()
  const [addOrder] = useAddOrderMutation()
  const navigate = useNavigate()

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const order = {
        name: data.name,
        email: user?.email,
        phone: data.phone,
        address: {
          city: data.city,
          state: data.state,
          country: data.country,
          zipcode: data.zipcode
        },
        book_ids: cart.items.map(item => item.id),
        total_price: cart.total
      }

      await addOrder(order).unwrap()
      
      await Swal.fire({
        title: 'Success!',
        text: 'Your order has been placed successfully.',
        icon: 'success',
        confirmButtonText: 'View Orders'
      })

      navigate('/orders')
    } catch (error) {
      console.error('Failed to place order:', error)
      Swal.fire({
        title: 'Error',
        text: 'Failed to place your order. Please try again.',
        icon: 'error'
      })
    }
  }

  if (cart.items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            {...register('phone', { required: 'Phone is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register('city', { required: 'City is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State/Province</label>
            <input
              type="text"
              {...register('state', { required: 'State is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              {...register('country', { required: 'Country is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
            <input
              type="text"
              {...register('zipcode', { required: 'ZIP code is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.zipcode && <p className="mt-1 text-sm text-red-600">{errors.zipcode.message}</p>}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Total</p>
            <p>${cart.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  )
}

export default Checkout