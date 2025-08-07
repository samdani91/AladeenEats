import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '../types';
import { apiClient } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  createUserProfile: (userData: Partial<User>) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: auth0User, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && auth0User) {
        try {
          const response = await apiClient.getUser();
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          // User might not exist, create one
          if (auth0User.email && auth0User.name) {
            await createUserProfile({
              email: auth0User.email,
              name: auth0User.name,
              role: 'customer'
            });
          }
        }
      }
      setIsLoading(false);
    };

    if (!auth0Loading) {
      fetchUser();
    }
  }, [isAuthenticated, auth0User, auth0Loading]);

  const createUserProfile = async (userData: Partial<User>) => {
    try {
      const response = await apiClient.createUser(userData);
      setUser(response.data);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      const response = await apiClient.updateUser(userData);
      setUser(response.data);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: auth0Loading || isLoading,
        createUserProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};