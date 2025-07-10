import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Cart from '@/pages/Cart';
import RestaurantRegistration from './pages/RestaurantRegistration';
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
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="cart" element={<Cart />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
      <Toaster richColors position="bottom-right" />
    </AuthProvider>
  );
}

export default App;