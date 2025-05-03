import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'

// Pages
import Home from './pages/Home'
import Books from './pages/Books'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="login" element={
          !isAuthenticated ? <Login /> : <Navigate to="/" replace />
        } />
        <Route path="register" element={
          !isAuthenticated ? <Register /> : <Navigate to="/" replace />
        } />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
