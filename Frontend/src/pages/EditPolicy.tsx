import React from 'react';
import { Heading } from '../components/Heading';
import { useLocation, useNavigate } from 'react-router-dom';
import PolicyForm from '../components/PolicyForm';

const EditPolicy: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const policyId = params.get('id');
  const navigate = useNavigate();

  return (
    <>
      <Heading name="Edit Policy" description="Edit the details of your existing insurance policies." />
      <div className="">
        <button
          className="mb-4 px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
          onClick={() => navigate('/policies')}
        >
          Back
        </button>
        <PolicyForm isUpdate={true} policyId={policyId} />
      </div>
    </>
  );
};
 
export default EditPolicy; 