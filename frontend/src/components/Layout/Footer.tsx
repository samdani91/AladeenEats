import React from 'react';
import { UtensilsCrossed, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <UtensilsCrossed className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AladeenEast</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Experience the finest culinary delights delivered straight to your doorstep. 
              Fast, fresh, and delicious meals from the best restaurants in your city.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@aladeeneast.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/restaurants" className="text-gray-300 hover:text-orange-400 transition-colors">Restaurants</a></li>
              <li><a href="/orders" className="text-gray-300 hover:text-orange-400 transition-colors">My Orders</a></li>
              <li><a href="/profile" className="text-gray-300 hover:text-orange-400 transition-colors">Profile</a></li>
              <li><a href="/help" className="text-gray-300 hover:text-orange-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-orange-400 transition-colors">About Us</a></li>
              <li><a href="/careers" className="text-gray-300 hover:text-orange-400 transition-colors">Careers</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-orange-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-orange-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 AladeenEast. All rights reserved. Made with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;