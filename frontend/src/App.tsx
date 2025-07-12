import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderTracking from '@/pages/OrderTracking';
import Profile from '@/pages/Profile';
import Orders from '@/pages/Orders';
import RestaurantRegistration from './pages/RestaurantRegistration';
import Restaurants from '@/pages/Restaurants';
import RestaurantDetail from '@/pages/RestaurantDetail';
import RestaurantDashboard from '@/pages/RestaurantDashboard';
import UserSettings from '@/pages/UserSettings';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/restaurantRegister' element={<RestaurantRegistration />} />
            <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="restaurant/:id" element={<RestaurantDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order/:id" element={<OrderTracking />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<UserSettings />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
      <Toaster richColors position="bottom-right" />
    </AuthProvider>
  );
}

export default App;