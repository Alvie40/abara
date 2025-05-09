import { Fragment } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const Layout = () => {
  const { isAuthenticated, logout } = useAuth()
  const cart = useSelector((state: RootState) => state.cart)

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-white shadow-sm">
        {() => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link to="/" className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold">BookStore</span>
                  </Link>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link to="/books" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                      Books
                    </Link>
                  </div>
                </div>

                <div className="flex items-center">
                  <Link to="/cart" className="p-2 text-gray-600 hover:text-gray-900 relative">
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cart.items.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {cart.items.length}
                      </span>
                    )}
                  </Link>

                  {isAuthenticated ? (
                    <Menu as="div" className="ml-3 relative">
                      <Menu.Button className="p-2 text-gray-600 hover:text-gray-900">
                        <UserIcon className="h-6 w-6" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link to="/orders" className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                                Orders
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => logout()}
                                className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <div className="ml-3 flex items-center space-x-4">
                      <Link to="/login" className="text-gray-900 hover:text-gray-700">
                        Sign in
                      </Link>
                      <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout