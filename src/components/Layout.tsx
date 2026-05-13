import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Flame, 
  FileText, 
  LogOut,
  Bell,
  User as UserIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'admin' 
    ? [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Incident Reports', path: '/admin/reports', icon: FileText },
      ]
    : [
        { name: 'Dashboard', path: '/user', icon: LayoutDashboard },
        { name: 'Report Incident', path: '/user/report', icon: Flame },
      ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Red Theme */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-red-700 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-red-800 border-b border-red-600 shadow-md">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider">
            <Flame className="text-yellow-400" fill="currentColor" />
            <span>FIRE<span className="text-black">ALERT</span></span>
          </div>
          <button onClick={closeSidebar} className="md:hidden text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6 px-2 py-3 bg-red-800/50 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-900 flex items-center justify-center border-2 border-red-500">
              <UserIcon size={20} />
            </div>
            <div>
              <p className="font-medium leading-tight">{user?.name}</p>
              <p className="text-xs text-red-200 capitalize">{user?.role}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin' || item.path === '/user'}
                onClick={closeSidebar}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                  isActive 
                    ? "bg-white text-red-700 font-semibold shadow-sm" 
                    : "text-red-100 hover:bg-red-600 hover:text-white"
                )}
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-red-600/50 bg-red-800/20">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-100 hover:bg-red-600 rounded-md transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar - Black Theme */}
        <header className="h-16 bg-gray-900 text-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-md z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="mr-4 md:hidden text-gray-300 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-medium hidden sm:block">
              {user?.role === 'admin' ? 'Command Center Dashboard' : 'Citizen Reporting Portal'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-gray-800">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-gray-900"></span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm border-l border-gray-700 pl-4 ml-2">
              <span className="text-gray-400">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
