import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const routes = [
    { path: '/', name: 'Home', exact: true },
    { path: '/account', name: 'Account' },
    { path: '/people', name: 'People' },
];

function Sidebar({ isAsideOpen, toggleAside, AuthContext }) {
    const { isAuthenticated, userData, logout } = useAuth();
    const handleLinkClick = () => {
        if (isAsideOpen) {
            toggleAside();
        }
    };
    return (
        <aside className={isAsideOpen ? 'open' : ''}>
            <nav>
                <ul>
                    <li className="route-open" onClick={toggleAside}></li>
                    {routes.map((route) => (
                        <li key={route.path} className={`route-${route.name.toLowerCase()}`}>
                            <NavLink
                                exact={route.exact}
                                to={route.path}
                                activeClassName="active"
                                onClick={handleLinkClick}
                            >
                                <span>{route.name}</span>
                            </NavLink>
                        </li>
                    ))}
                    <li className={"route-logout"}><a onClick={logout}><span>Logout</span></a></li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;