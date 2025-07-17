import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PolicyPDF from './PolicyPDF';

interface ViewPolicyModalProps {
  open: boolean;
  onClose: () => void;
  data: any | null;
  onEdit?: (policyId: number | string) => void;
  policyId?: number | string;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-base font-semibold mb-2 text-primary">{title}</h3>
    <div className="bg-gray-50 rounded p-4 border border-gray-100">{children}</div>
  </div>
);

const ViewPolicyModal: React.FC<ViewPolicyModalProps> = ({ open, onClose, data, onEdit, policyId }) => {
  if (!open || !data) return null;
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
      
        <div className="absolute top-2 right-2 flex gap-2 flex-wrap">
           <PDFDownloadLink
            document={<PolicyPDF data={data} />}
            fileName={`policy-${data.policyNo}.pdf`}
          >
            {({ loading }) => (
              <button 
                className="px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 text-sm font-semibold"
                title="Download PDF"
              >
                {loading ? 'Preparing...' : 'Download PDF'}
              </button>
            )}
          </PDFDownloadLink>

       

          {onEdit && policyId && (
            <button
              className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm font-semibold"
              onClick={() => onEdit(policyId)}
              title="Edit"
            >
              Edit
            </button>
          )}

          <button
            className="text-gray-400 hover:text-gray-600 text-2xl ml-2"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">Policy Details</h2>

    
        <Section title="Policy Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="font-medium text-gray-600">Policy No:</span> {data.policyNo}</div>
            <div><span className="font-medium text-gray-600">Status:</span> {data.policyStatus}</div>
            <div><span className="font-medium text-gray-600">Type:</span> {data.policyType}</div>
            <div><span className="font-medium text-gray-600">Effective Date:</span> {data.policyEffectiveDate}</div>
            <div><span className="font-medium text-gray-600">Expiration Date:</span> {data.policyExpirationDate}</div>
          </div>
        </Section>

      
        <Section title="Policy Holder">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="font-medium text-gray-600">Name:</span> {data.policyHolder.firstName} {data.policyHolder.lastName}</div>
            <div><span className="font-medium text-gray-600">Address:</span> {data.policyHolder.address.street}, {data.policyHolder.address.city}, {data.policyHolder.address.state} {data.policyHolder.address.zip}</div>
          </div>
        </Section>

 
        <Section title="Drivers">
          <div className="space-y-4">
            {data.drivers.map((driver: any, idx: number) => (
              <div key={idx} className="border-b pb-2 last:border-b-0 last:pb-0">
                <div className="font-semibold text-gray-700 mb-1">{driver.firstName} {driver.lastName}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div><span className="font-medium text-gray-600">Age:</span> {driver.age}</div>
                  <div><span className="font-medium text-gray-600">Gender:</span> {driver.gender}</div>
                  <div><span className="font-medium text-gray-600">Marital Status:</span> {driver.maritalStatus}</div>
                  <div><span className="font-medium text-gray-600">License #:</span> {driver.licenseNumber}</div>
                  <div><span className="font-medium text-gray-600">License State:</span> {driver.licenseState}</div>
                  <div><span className="font-medium text-gray-600">License Status:</span> {driver.licenseStatus}</div>
                  <div><span className="font-medium text-gray-600">License Effective:</span> {driver.licenseEffectiveDate}</div>
                  <div><span className="font-medium text-gray-600">License Expiry:</span> {driver.licenseExpirationDate}</div>
                  <div><span className="font-medium text-gray-600">License Class:</span> {driver.licenseClass}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

  
        <Section title="Vehicles">
          <div className="space-y-4">
            {data.vehicles.map((vehicle: any, idx: number) => (
              <div key={idx} className="border-b pb-2 last:border-b-0 last:pb-0">
                <div className="font-semibold text-gray-700 mb-1">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-2">
                  <div><span className="font-medium text-gray-600">VIN:</span> {vehicle.vin}</div>
                  <div><span className="font-medium text-gray-600">Usage:</span> {vehicle.usage}</div>
                  <div><span className="font-medium text-gray-600">Primary Use:</span> {vehicle.primaryUse}</div>
                  <div><span className="font-medium text-gray-600">Annual Mileage:</span> {vehicle.annualMileage}</div>
                  <div><span className="font-medium text-gray-600">Ownership:</span> {vehicle.ownership}</div>
                  <div><span className="font-medium text-gray-600">Garaging Address:</span> {vehicle.garagingAddress.street}, {vehicle.garagingAddress.city}, {vehicle.garagingAddress.state} {vehicle.garagingAddress.zip}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Coverages:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {vehicle.coverages.map((cov: any, cidx: number) => (
                      <li key={cidx} className="text-sm">
                        <span className="font-semibold">{cov.type}</span>: Limit R{cov.limit}, Deductible R{cov.deductible}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-2 rounded bg-primary text-white hover:bg-primary/90 text-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPolicyModal;
