import React from 'react';
import { useFieldArray, Control, FieldErrors } from 'react-hook-form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { InputField, SelectField } from './PolicyForm';

type VehicleFormProps = {
  control: Control<any>;
  errors: FieldErrors<any>;
  submitAttempted: boolean;
  vehicleIndex: number;
  removeVehicle: (index: number) => void;
  vehicleFieldsLength: number;
};

export function VehicleForm({ control, errors, submitAttempted, vehicleIndex: vIdx, removeVehicle, vehicleFieldsLength }: VehicleFormProps) {
  const { fields: coverageFields, append: appendCoverage, remove: removeCoverage } = useFieldArray({
    control,
    name: `vehicles.${vIdx}.coverages`,
  });

  // Determine vehicle background color and heading
  const vehicleBg = vIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white';
  const vehicleHeading = `Vehicle ${vIdx + 1}`;

  return (
    <div className={`border rounded-lg p-4 mb-4 relative ${vehicleBg}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">{vehicleHeading}</h2>
        {vehicleFieldsLength > 1 && (
          <button type="button" onClick={() => removeVehicle(vIdx)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField control={control} errors={errors} label="Year" name={`vehicles.${vIdx}.year`} type="number" submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="Make" name={`vehicles.${vIdx}.make`} submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="Model" name={`vehicles.${vIdx}.model`} submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="VIN" name={`vehicles.${vIdx}.vin`} submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="Usage" name={`vehicles.${vIdx}.usage`} submitAttempted={submitAttempted} />
        <SelectField control={control} errors={errors} label="Primary Use" name={`vehicles.${vIdx}.primaryUse`} options={['Commute', 'Business', 'Personal']} submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="Annual Mileage" name={`vehicles.${vIdx}.annualMileage`} submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="Ownership" name={`vehicles.${vIdx}.ownership`} submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="Street" name={`vehicles.${vIdx}.garagingAddress.street`} submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="City" name={`vehicles.${vIdx}.garagingAddress.city`} submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="State" name={`vehicles.${vIdx}.garagingAddress.state`} submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="ZIP Code" name={`vehicles.${vIdx}.garagingAddress.zip`} submitAttempted={submitAttempted} />
      </div>
      <div className="mt-6">
        {coverageFields.map((coverage, cIdx) => {
          const coverageBg = cIdx % 2 === 0 ? 'bg-gray-100' : 'bg-white';
          const coverageHeading = `Vehicle ${vIdx + 1} Coverage ${cIdx + 1}`;
          return (
            <div key={coverage.id} className={`mb-4 rounded-md p-4 relative ${coverageBg}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700">{coverageHeading}</h3>
                {coverageFields.length > 1 && (
                  <button type="button" onClick={() => removeCoverage(cIdx)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField control={control} errors={errors} label="Type" name={`vehicles.${vIdx}.coverages.${cIdx}.type`} options={['Liability', 'Collision', 'Comprehensive']} submitAttempted={submitAttempted} />
                <InputField control={control} errors={errors} label="Limit" name={`vehicles.${vIdx}.coverages.${cIdx}.limit`} type="number" submitAttempted={submitAttempted} />
                <InputField control={control} errors={errors} label="Deductible" name={`vehicles.${vIdx}.coverages.${cIdx}.deductible`} type="number" submitAttempted={submitAttempted} />
              </div>
            </div>
          );
        })}
        <button type="button" onClick={() => appendCoverage({ id: Date.now() + Math.random(), type: '', limit: '', deductible: '' })} className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4"><PlusCircle className="mr-1" size={18} /> Add Coverage</button>
      </div>
    </div>
  );
} 