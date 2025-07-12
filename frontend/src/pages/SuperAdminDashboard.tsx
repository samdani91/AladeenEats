/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Application {
  id: string;
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  image: string;
  licenseNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  ownerId: string;
}

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Mock API call to fetch restaurant applications
    const fetchApplications = async () => {
      try {
        // Replace with real API call
        const mockData: Application[] = [
          {
            id: '1',
            restaurantName: 'Taste Haven',
            email: 'taste@haven.com',
            phone: '123-456-7890',
            address: '123 Food St, Foodville',
            description: 'A cozy spot for delicious meals',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&h=300',
            licenseNumber: 'LIC123',
            status: 'pending',
            ownerId: 'user1',
          },
          {
            id: '2',
            restaurantName: 'Spice Delight',
            email: 'spice@delight.com',
            phone: '987-654-3210',
            address: '456 Spice Ln, Spicetown',
            description: 'Spicy cuisine with a twist',
            image: 'https://images.unsplash.com/photo-1552566626-52f8b0bb540a?auto=format&fit=crop&w=300&h=300',
            licenseNumber: 'LIC456',
            status: 'pending',
            ownerId: 'user2',
          },
          {
            id: '3',
            restaurantName: 'Sweet Retreat',
            email: 'sweet@retreat.com',
            phone: '555-123-4567',
            address: '789 Dessert Ave, Sweetland',
            description: 'Delicious desserts and pastries',
            image: 'https://images.unsplash.com/photo-1551024602-071a3479ce1c?auto=format&fit=crop&w=300&h=300',
            licenseNumber: 'LIC789',
            status: 'approved',
            ownerId: 'user3',
          },
          {
            id: '4',
            restaurantName: 'Grill House',
            email: 'grill@house.com',
            phone: '111-222-3333',
            address: '101 BBQ Rd, Grillville',
            description: 'Best grilled meats in town',
            image: 'https://images.unsplash.com/photo-1534352726354-94676606a281?auto=format&fit=crop&w=300&h=300',
            licenseNumber: 'LIC012',
            status: 'rejected',
            ownerId: 'user4',
          },
          // Added more mock data to ensure sidebar scrolling
          { id: '5', restaurantName: 'Pizza Palace', email: 'pizza@palace.com', phone: '222-333-4444', address: '900 Cheese Ave, Pizzaville', description: 'The best pizza in town, delivered fast!', image: 'https://images.unsplash.com/photo-1593560704563-ad2133e2d677?auto=format&fit=crop&w=300&h=300', licenseNumber: 'LIC013', status: 'pending', ownerId: 'user5', },
          { id: '6', restaurantName: 'Burger Bistro', email: 'burger@bistro.com', phone: '777-888-9999', address: '500 Patty Rd, Burgertown', description: 'Gourmet burgers for every taste.', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=300&h=300', licenseNumber: 'LIC014', status: 'pending', ownerId: 'user6', },
          { id: '7', restaurantName: 'Vegan Vanguard', email: 'vegan@vanguard.com', phone: '111-222-5555', address: '300 Green St, Veggieville', description: 'Healthy and delicious plant-based meals.', image: 'https://images.unsplash.com/photo-1512621776951-a57342898083?auto=format&fit=crop&w=300&h=300', licenseNumber: 'LIC015', status: 'pending', ownerId: 'user7', },
          { id: '8', restaurantName: 'Sushi Spot', email: 'sushi@spot.com', phone: '333-444-5555', address: '600 Ocean Dr, Fishland', description: 'Authentic Japanese sushi and sashimi.', image: 'https://images.unsplash.com/photo-1579871771424-c10a12e432c6?auto=format&fit=crop&w=300&h=300', licenseNumber: 'LIC016', status: 'pending', ownerId: 'user8', },
        ];
        setApplications(mockData);
        const firstPending = mockData.find(app => app.status === 'pending');
        setSelectedAppId(firstPending ? firstPending.id : mockData.length > 0 ? mockData[0].id : null);
      } catch (error) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setApplications(applications.map(app => app.id === id ? { ...app, status: 'approved' } : app));
      toast.success('Restaurant approved successfully!');
    } catch (error) {
      toast.error('Failed to approve restaurant');
    }
  };

  const handleReject = async (id: string) => {
    try {
      setApplications(applications.map(app => app.id === id ? { ...app, status: 'rejected' } : app));
      toast.success('Restaurant rejected successfully!');
    } catch (error) {
      toast.error('Failed to reject restaurant');
    }
  };

  const selectedApplication = applications.find(app => app.id === selectedAppId);

  if (!user || user.role !== 'superAdmin') {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">Unauthorized access. Please log in as a Super Admin.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23f97316%27 fill-opacity=%270.05%27%3E%3Ccircle cx=%2730%27 cy=%2730%27 r=%272%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      {/* Header Section (Fixed at Top) */}
      <header className="relative z-20 w-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 shadow-xl p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between">
          <Link to="/" className="flex items-center">
            <Button variant="ghost" size="sm" className="hover:bg-white/30 backdrop-blur-sm rounded-xl text-white p-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Back to Home</span>
            </Button>
          </Link>
          <div className="text-center flex-grow">
            <h1 className="text-3xl font-extrabold text-white">Aladeen Eats Admin</h1>
            <p className="text-white/80 text-sm">Manage restaurant applications</p>
          </div>
          <div className="hidden sm:block w-24"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full py-6 px-4 md:px-0 relative z-10">
        {/* Toggle Button for Small Devices (Fixed) */}
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed top-24 left-4 z-30 bg-white/90 shadow-lg rounded-full p-2"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </Button>

        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 md:top-auto left-0 h-full md:h-auto bg-white/95 shadow-2xl md:rounded-l-xl p-4 transition-transform duration-300 z-20 overflow-y-auto ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 w-64 flex-shrink-0 md:pt-0`}
        >
          <div className="md:hidden h-[6.5rem] sm:h-[6.5rem]"></div>

          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 pt-5">Applications</h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : applications.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No applications to display.</p>
          ) : (
            <ul className="space-y-2">
              {applications.map((app) => (
                <li key={app.id}>
                  <button
                    onClick={() => {
                      setSelectedAppId(app.id);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex justify-between items-center text-left p-3 rounded-lg transition-colors duration-200 ${
                      selectedAppId === app.id
                        ? 'bg-orange-100 text-orange-800 font-semibold shadow-inner'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span>{app.restaurantName}</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        app.status === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : app.status === 'approved'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-6  md:rounded-r-xl  overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !selectedApplication ? (
            <div className="text-center py-20 text-gray-700 text-lg">
              <p className="mb-2">No application selected.</p>
              <p>Please select an application from the sidebar to view its details.</p>
            </div>
          ) : (
            <Card className="border-0  transition-all duration-300 rounded-xl overflow-hidden">
              <CardHeader className="p-0 relative">
                {selectedApplication.image && (
                  <div className="relative w-full h-64 md:h-80 overflow-hidden">
                    <img
                      src={selectedApplication.image}
                      alt={selectedApplication.restaurantName}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                )}
                <div className="p-6">
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-2">{selectedApplication.restaurantName}</CardTitle>
                  <CardDescription className="text-md text-gray-600">
                    Application ID: <span className="font-mono text-gray-800">{selectedApplication.id}</span> | Owner ID: <span className="font-mono text-gray-800">{selectedApplication.ownerId}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Contact Information</h3>
                    <p className="text-gray-700 flex items-center"><span className="font-medium mr-2">Email:</span> {selectedApplication.email}</p>
                    <p className="text-gray-700 flex items-center"><span className="font-medium mr-2">Phone:</span> {selectedApplication.phone}</p>
                    <p className="text-gray-700 flex items-center"><span className="font-medium mr-2">Address:</span> {selectedApplication.address}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Restaurant Details</h3>
                    <p className="text-gray-700"><span className="font-medium">Description:</span> {selectedApplication.description}</p>
                    <p className="text-gray-700"><span className="font-medium">License Number:</span> {selectedApplication.licenseNumber}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t">
                  <div className="mb-4 sm:mb-0">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                        selectedApplication.status === 'pending'
                          ? 'bg-yellow-400 text-yellow-900'
                          : selectedApplication.status === 'approved'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      Status: {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                    </span>
                  </div>
                  {selectedApplication.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                      <Button
                        size="lg"
                        onClick={() => handleApprove(selectedApplication.id)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-transform transform hover:scale-105 w-full sm:w-auto"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" /> Approve
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => handleReject(selectedApplication.id)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-transform transform hover:scale-105 w-full sm:w-auto"
                      >
                        <XCircle className="h-5 w-5 mr-2" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;