import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CreditCard, Edit, MapPin, Save, User } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const cameroonCities = [
    'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Buea', 'Limbe', 
    'Kribi', 'Garoua', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa'
  ];
  
  const [preferredRoutes, setPreferredRoutes] = useState<string[]>(
    user?.preferred_routes || []
  );

  const handleSaveProfile = async () => {
    try {
      const { error } = await updateProfile({
        full_name: fullName,
        phone,
        email,
        preferred_routes: preferredRoutes
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const togglePreferredRoute = (route: string) => {
    if (preferredRoutes.includes(route)) {
      setPreferredRoutes(preferredRoutes.filter(r => r !== route));
    } else {
      setPreferredRoutes([...preferredRoutes, route]);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-800 text-white p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Profile</h1>
                {isEditing ? (
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-150"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-150"
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    Edit
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.full_name || 'User'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-150">
                          <Camera className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-1">
                      {user.full_name || 'User'}
                    </h2>
                    <p className="text-gray-600 mb-4">{user.phone}</p>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{user.full_name || 'Not set'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{user.phone || 'Not set'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email (Optional)
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{user.email || 'Not set'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Verification
                      </label>
                      <div className="flex items-center">
                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          Not Verified
                        </div>
                        {isEditing && (
                          <button className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Upload ID
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Preferred Routes</h3>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {cameroonCities.map((city, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`city-${index}`}
                              checked={preferredRoutes.includes(city)}
                              onChange={() => togglePreferredRoute(city)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`city-${index}`} className="ml-2 text-sm text-gray-700">
                              {city}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {preferredRoutes.length > 0 ? (
                          preferredRoutes.map((route, index) => (
                            <div 
                              key={index}
                              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              <MapPin className="h-4 w-4 mr-1" />
                              {route}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No preferred routes set</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md mb-4">
                      <div className="flex items-center">
                        <div className="bg-yellow-500 p-2 rounded-md mr-4">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">MTN Mobile Money</p>
                          <p className="text-sm text-gray-600">
                            {user.phone || 'No phone number set'}
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Default
                      </div>
                    </div>
                    
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      + Add Payment Method
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;