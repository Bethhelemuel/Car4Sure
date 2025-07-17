import React from 'react';
import { Home, FileText, PlusCircle, Pencil, BarChart2, LogOut,Car,Users,Album } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const sidebarItems = [
  { name: 'Home', icon: Home, route: '/home' },
  { name: 'Policies', icon: FileText, route: '/policies' },
  { name: 'Add Policy', icon: PlusCircle, route: '/add-policy' },
  { name: 'Vehicles', icon: Car, route: '/vehicles' },
  { name: 'Drivers', icon: Users, route: '/drivers' },
  { name: 'Addresses', icon: Album, route: '/addresses' },
];

const LeftSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-16 md:w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col justify-between">
      <div className="p-4">
       
        <img src={require('../assets/logo.png')} alt="Logo" className="hidden md:block w-32 mx-auto mb-8" />
        <div className="mt-8 space-y-4">
          {sidebarItems.map((item, idx) => (
            <React.Fragment key={item.name}>
              {item.name === 'Vehicles' && <hr />}
              <NavLink
                to={item.route}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-150 ` +
                  (isActive ? 'bg-primary text-white hover:bg-primary' : '')
                }
                end
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-black'}`} />
                    <span className="hidden md:block">{item.name}</span>
                  </>
                )}
              </NavLink>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="p-4 mb-2 flex flex-col">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-semibold focus:outline-none"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden md:inline">Logout</span>
        </button>
        <div className="mt-4 text-xs text-gray-400  select-none">
          &copy; {year} Thato Mphugo
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar; 