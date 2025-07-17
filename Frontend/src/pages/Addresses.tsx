import React, { useEffect, useState } from 'react';
import { Heading } from '../components/Heading';
import ExtraTableViews from '../components/ExtraTableViews';
import { useAuth } from '../contexts/AuthContext';
import { LoaderCircle } from 'lucide-react';

const columns = ['Policy Number', 'Type', 'Name/Vehicle', 'Street', 'City', 'State', 'Zip'];

export default function Addresses() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/getalladdresses`,
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
      setAddresses(json || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const formatAddressData = () => {
    return addresses.map((address: any) => ({
      'Policy Number': address.policyNumber,
      'Type': address.type,
      'Name/Vehicle': address.type === 'PolicyHolder' 
        ? `${address.firstName} ${address.lastName}`
        : `${address.vehicleMake} ${address.vehicleModel}`,
      'Street': address.street,
      'City': address.city,
      'State': address.state,
      'Zip': address.zip,
    }));
  };

  return (
    <>
      <Heading name="Addresses" description="Browse all your policy addresses in one place" />
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <ExtraTableViews columns={columns} datalist={formatAddressData()} title="Address List" />
      )}
    </>
  );
} 