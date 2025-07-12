import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';


interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
	logout: () => void;
	updateUser: (userData: Partial<User>) => void;
	updatePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
	deleteAccount: (data: { password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check for existing token on mount
		const token = localStorage.getItem('auth_token');
		const userData = localStorage.getItem('user_data');

		if (token && userData) {
			try {
				setUser(JSON.parse(userData));
			} catch {
				localStorage.removeItem('auth_token');
				localStorage.removeItem('user_data');
			}
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const response = await fetch('http://localhost:5000/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			if (!response.ok) throw new Error('Login failed');
			const data = await response.json();
			localStorage.setItem('auth_token', data.token);
			localStorage.setItem('user_data', JSON.stringify(data.user));
			setUser(data.user);
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (email: string, password: string, name: string, phone?: string) => {
		setIsLoading(true);
		try {
			console.log('Sending registration request:', { name, email, phone }); // Debug log

			const response = await fetch('http://localhost:5000/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, password, phone }),
			});

			console.log('Response status:', response.status); // Debug log

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Registration failed');
			}

			const data = await response.json();
			console.log('Registration successful:', data); // Debug log

			localStorage.setItem('auth_token', data.token);
			localStorage.setItem('user_data', JSON.stringify(data.user));
			setUser(data.user);
		} catch (error) {
			console.error('Registration error:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem('auth_token');
		localStorage.removeItem('user_data');
		setUser(null);
	};

	const updateUser = (userData: Partial<User>) => {
		if (user) {
			const updatedUser = { ...user, ...userData };
			setUser(updatedUser);
			localStorage.setItem('user_data', JSON.stringify(updatedUser));
		}
	};

	const updatePassword = async (data: { currentPassword: string; newPassword: string }) => {
		setIsLoading(true);
		try {
			const response = await fetch('http://localhost:5000/api/auth/update-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to update password');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const deleteAccount = async (data: { password: string }) => {
		setIsLoading(true);
		try {
			const response = await fetch('http://localhost:5000/api/auth/delete-account', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to delete account');
			}
			localStorage.removeItem('auth_token');
			localStorage.removeItem('user_data');
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthContext.Provider value={{
			user,
			isLoading,
			login,
			register,
			logout,
			updateUser,
			updatePassword,
			deleteAccount
		}}>
			{children}
		</AuthContext.Provider>
	);
};