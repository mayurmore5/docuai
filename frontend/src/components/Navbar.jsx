import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, FileText, Home, Info, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [theme, setTheme] = useState('dark');
    const location = useLocation();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/about', label: 'About', icon: Info },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="logo">
                    <FileText className="logo-icon" />
                    <span>DocuAI</span>
                </Link>

                <div className="nav-links">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                            {location.pathname === item.path && (
                                <motion.div
                                    layoutId="underline"
                                    className="nav-underline"
                                />
                            )}
                        </Link>
                    ))}

                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
