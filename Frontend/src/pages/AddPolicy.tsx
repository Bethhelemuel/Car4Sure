import React from 'react';
import { Heading } from '../components/Heading';
import PolicyForm from '../components/PolicyForm';

const AddPolicy: React.FC = () => (
  <>
    <Heading name="Add Policy" description="Add a new insurance policy to your account." />
    <PolicyForm isUpdate={false} />
  </>
);

export default AddPolicy; 


