import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RouteHandler = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // текущий маршрут для добавления класса
    const currentRoute = !isAuthenticated || location.pathname === '/login'
        ? 'login'
        : location.pathname.substring(1) || 'home';

    useEffect(() => {
        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.className = `root ${currentRoute}`; // Добавляем нужный класс к #root
        }

        // очистка классов
        return () => {
            document.documentElement.className = '';
            document.body.className = '';
        };
    }, [currentRoute]);

    return (
        <div className={`app`}>
            {children}
        </div>
    );
};

export default RouteHandler;
