import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, User, LogOut, Settings, Package, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const totalItems = getTotalItems();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg' 
        : 'bg-white border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-white font-bold text-lg">AE</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Aladeen Eats
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all duration-300 bg-gray-50/50 focus:bg-white"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Location */}
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300 rounded-lg">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Deliver to</span>
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 rounded-lg group">
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 border-2 border-white animate-pulse"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-orange-500/20 transition-all duration-300">
                    <Avatar className="h-10 w-10 ring-2 ring-transparent hover:ring-orange-500/30 transition-all duration-300">
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="w-[180px] truncate text-sm text-gray-600">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-orange-50 transition-colors">
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-orange-50 transition-colors">
                    <Link to="/orders" className="flex items-center">
                      <Package className="mr-3 h-4 w-4 text-gray-500" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-orange-50 transition-colors">
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'restaurant' && (
                    <>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-orange-50 transition-colors">
                        <Link to="/restaurant/dashboard" className="flex items-center">
                          <Settings className="mr-3 h-4 w-4 text-gray-500" />
                          Restaurant Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors">
                    <LogOut className="mr-3 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" asChild className="hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 rounded-lg">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-orange-50 transition-colors rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg"
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-fade-in-scale">
          <div className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start rounded-lg hover:bg-orange-50">
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start rounded-lg hover:bg-orange-50">
                    <Package className="mr-3 h-4 w-4" />
                    Orders
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start rounded-lg hover:bg-red-50 text-red-600">
                  <LogOut className="mr-3 h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full rounded-lg hover:bg-orange-50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;