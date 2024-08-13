import React, { createContext, useState, useContext, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    const register = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Произошла ошибка при регистрации');
            }

            const data = await response.json();
            console.log('Register response data:', data);

            localStorage.setItem('authToken', data.token);
            if (data.user) {
                localStorage.setItem('userData', JSON.stringify(data.user));
                setUserData(data.user);
            } else {
                console.warn('User data is undefined or null');
            }
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const login = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Произошла ошибка при входе');
            }

            const data = await response.json();
            console.log('Login response data:', data); // Добавьте этот лог для отладки

            localStorage.setItem('authToken', data.token);
            if (data.user) {
                localStorage.setItem('userData', JSON.stringify(data.user));
                setUserData(data.user);
            } else {
                console.warn('User data is undefined or null');
            }
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };


    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setUserData(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
            const savedUserData = localStorage.getItem('userData');
            if (savedUserData) {
                setUserData(JSON.parse(savedUserData));
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout, setIsAuthenticated, userData }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
