
import React, { createContext } from 'react';
import { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | null>(null);

// A valid, non-expiring JWT for payload { id: 'mockUserId12345' }
// signed with the server's hardcoded secret 'this-is-a-temporary-secret-for-testing'
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1vY2tVc2VySWQxMjM0NSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const mockUser: User = {
    _id: 'mockUserId12345',
    name: 'Test User',
    email: 'test@example.com',
    token: MOCK_TOKEN,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Provide a static user object and no-op functions for login/logout,
    // as these features have been removed.
    const value: AuthContextType = {
        user: mockUser,
        loading: false,
        login: async () => { console.warn('Login functionality is disabled.'); },
        register: async () => { console.warn('Registration functionality is disabled.'); },
        logout: () => { console.warn('Logout functionality is disabled.'); },
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};