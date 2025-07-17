import React, { useEffect, useState } from 'react';
import { Heading } from '../components/Heading';
import { FileText, PlusCircle, Users, Car, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/dashboard`, {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ user_id: user?.id }),
        });
        if (!res.ok) throw new Error('Failed to fetch dashboard');
        const data = await res.json();
        setDashboard(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchDashboard();
  }, [user]);

  return (
    <>
      <Heading name="Dashboard" description="Welcome to the Car4Sure dashboard. View your summary and quick links here." />
      <div className="p-4">
       
        <div className="mb-8">
          {loading ? (
            <div className="text-lg text-gray-500">Loading dashboard...</div>
          ) : error ? (
            <div className="text-red-600 font-semibold">{error}</div>
          ) : dashboard ? (
            <>
              <h2 className="text-xl font-bold mb-10 text-blue-600">
                Hi, {user?.name ? user.name : "User"} you have {dashboard.totalPolicies} total policies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">

                   <div className="text-3xl font-bold text-blue-600">{dashboard.policiesByStatus?.Active || 0}</div>
                  <div className="text-gray-700 mt-2">Active Policies</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">


                  <div className="text-3xl font-bold text-yellow-600">{dashboard.policiesByStatus?.Inactive || 0}</div>
                  <div className="text-gray-700 mt-2">Inactive Policies</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">


                  <div className="text-3xl font-bold text-red-600">{dashboard.policiesByStatus?.Expired || 0}</div>
                  <div className="text-gray-700 mt-2">Expired Policies</div>

                </div>
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  
                    <div className="text-3xl font-bold text-green-600">{dashboard.totalDrivers}</div>
                  <div className="text-gray-700 mt-2">Total Drivers</div>
                </div>
                 <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                   
                    <div className="text-3xl font-bold text-purple-600">{dashboard.totalVehicles}</div>
                
                  <div className="text-gray-700 mt-2">Total Vehicles</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold text-pink-600">{dashboard.totalAddresses}</div>
                  <div className="text-gray-700 mt-2">Total Addresses</div>
                </div>
              </div>
            </>
          ) : null}
       
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
            <button
              onClick={() => navigate('/policies')}
              className={`flex flex-col items-center justify-center rounded-lg shadow bg-white hover:shadow-lg transition p-6 border border-gray-100 hover:bg-gray-50 focus:outline-none`}
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-3 bg-blue-100 text-blue-700`}>
                <FileText size={28} />
              </div>
              <div className="text-lg font-bold mb-1">Policies</div>
              <div className="text-gray-500 text-sm text-center">View and manage all your policies</div>
            </button>
            <button
              onClick={() => navigate('/add-policy')}
              className={`flex flex-col items-center justify-center rounded-lg shadow bg-white hover:shadow-lg transition p-6 border border-gray-100 hover:bg-gray-50 focus:outline-none`}
            >
          
              <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-3 bg-green-100 text-green-700`}>
                <PlusCircle size={28} />
              </div>
             
                 <div className="text-lg font-bold mb-1">Add Policy</div>
              <div className="text-gray-500 text-sm text-center">Create a new insurance policy</div>
            </button>
         
          </div>
        </div>
      </div>
    </>
  );
};

export default Home; 