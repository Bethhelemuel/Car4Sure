import React, { useEffect, useState } from 'react';
import ExtraTableViews from '../components/ExtraTableViews';
import { Heading } from '../components/Heading';
import { useAuth } from '../contexts/AuthContext';
import { LoaderCircle } from 'lucide-react';

const columns = ['Policy Number', 'Year', 'Make', 'Model', 'VIN', 'Usage', 'Primary Use', 'Annual Mileage', 'Ownership'];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/getallvehicles`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ user_id: user?.id }),
        }
      );
      const json = await res.json();
      setVehicles(json || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const formatVehicleData = () => {
    return vehicles.map((vehicle: any) => ({
      'Policy Number': vehicle.policyNumber,
      'Year': vehicle.year,
      'Make': vehicle.make,
      'Model': vehicle.model,
      'VIN': vehicle.vin,
      'Usage': vehicle.usage,
      'Primary Use': vehicle.primaryUse,
      'Annual Mileage': vehicle.annualMileage,
      'Ownership': vehicle.ownership,
    }));
  };

  return (
    
    <>
      <Heading name="Vehicles" description="Browse all your policy vehicles in one place" />
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <ExtraTableViews columns={columns} datalist={formatVehicleData()} title="Vehicle List" />
      )}
    </>
  );
} 