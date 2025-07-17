import React, { useEffect, useState } from 'react';
import { Heading } from '../components/Heading';
import ExtraTableViews from '../components/ExtraTableViews';
import { useAuth } from '../contexts/AuthContext';
import { LoaderCircle } from 'lucide-react';

const columns = ['Policy Number', 'Name', 'Age', 'Gender', 'Marital Status', 'License Number', 'License State', 'License Status', 'License Class'];

export default function Drivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/getalldrivers`,
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
      setDrivers(json || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [user]);

  const formatDriverData = () => {
    return drivers.map((driver: any) => ({
      'Policy Number': driver.policyNumber,
      'Name': `${driver.firstName} ${driver.lastName}`,
      'Age': driver.age,
      'Gender': driver.gender,
      'Marital Status': driver.maritalStatus,
      'License Number': driver.licenseNumber,
      'License State': driver.licenseState,
      'License Status': driver.licenseStatus,
      'License Class': driver.licenseClass,
    }));
  };

  return (
    <>
      <Heading name="Drivers" description="Browse all your policy drivers in one place" />
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <ExtraTableViews columns={columns} datalist={formatDriverData()} title="Driver List" />
      )}
    </>
  );
} 