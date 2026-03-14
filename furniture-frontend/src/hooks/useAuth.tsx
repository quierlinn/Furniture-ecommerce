import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, AuthResponse, LoginCredentials, RegisterCredentials } from '../types';
import { api } from '../api/client';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (credentials: RegisterCredentials) => Promise<User>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.login(credentials);
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        return response;
    };

    const register = async (credentials: RegisterCredentials): Promise<User> => {
        const newUser = await api.register(credentials);
        return newUser;
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            isLoading,
            login,
            register,
            logout,
            refreshUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
