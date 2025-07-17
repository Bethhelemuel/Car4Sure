import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ChevronLeft, ChevronRight, PlusCircle, Trash2 } from 'lucide-react';
import get from "lodash/get";
import { useToast } from '../components/ToastProvider'; 
import { VehicleForm } from './VehicleForm';
import { useAuth } from '../contexts/AuthContext';

function generatePolicyNo() {
  const random = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now().toString().slice(-4);
  return `P-${timestamp}${random}`;
}

function getDefaultValues() {
  return {
    policyNo: generatePolicyNo(),
  policyStatus: '',
    policyType: 'Auto',
  policyEffectiveDate: '',
  policyExpirationDate: '',
  policyHolder: {
    firstName: '',
    lastName: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  },
    drivers: [
      {
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    maritalStatus: '',
    licenseNumber: '',
    licenseState: '',
    licenseStatus: '',
    licenseEffectiveDate: '',
    licenseExpirationDate: '',
    licenseClass: ''
      }
    ],
    vehicles: [
      { 
    year: '',
    make: '',
    model: '',
    vin: '',
    usage: '',
    primaryUse: '',
    annualMileage: '',
    ownership: '',
    garagingAddress: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    coverages: [
          { id: Date.now() + Math.random(), type: 'Liability', limit: '', deductible: '' }
        ]
      }
    ]
  };
}

const steps = [
  { id: 1, title: 'Policy Info', description: 'Basic policy information' },
  { id: 2, title: 'Policy Holder', description: 'Personal information' },
  { id: 3, title: 'Driver Details', description: 'License information' },
  { id: 4, title: 'Vehicle & Coverage', description: 'Vehicle and coverage details' }
];

// Define the form data type
interface PolicyFormValues {

  policyNo: string;
  policyStatus: string;
  policyType: string;
  policyEffectiveDate: string;
  policyExpirationDate: string;
  policyHolder: {
    firstName: string;
    lastName: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  drivers: Array<any>;
  vehicles: Array<{
    year: string;
    make: string;
    model: string;
    vin: string;
    usage: string;
    primaryUse: string;
    annualMileage: string;
    ownership: string;
    garagingAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    coverages: Array<any>;
  }>;
}


export const InputField = React.memo(({ control, errors, label, name, submitAttempted, autoFocus, ...rest }: any) => {
  const id = `field-${name.replace(/\./g, '-')}`;
  const inputRef = useRef<HTMLInputElement>(null); 
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);  

  useEffect(() => {
    if (autoFocus && inputRef.current) {
  
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [autoFocus]);

 
  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field, fieldState }) => {
        const { ref: rhfRef, ...fieldProps } = field;
        return (
          <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
              {label} <span className="text-red-500">*</span>
            </label>
            <input
              id={id}
              ref={el => {
                inputRef.current = el;
                if (typeof rhfRef === 'function') rhfRef(el);
                else if (rhfRef) (rhfRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
              }}
              {...fieldProps}
              {...rest}
              className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                ((fieldState.isTouched || submitAttempted) && get(errors, name)?.type === 'required') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {((fieldState.isTouched || submitAttempted) && get(errors, name)?.type === 'required') && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
    </div>
  );
      }}
    />
  );
});

// Enhanced SelectField with better focus management
export const SelectField = React.memo(({ control, errors, label, name, options, submitAttempted, ...rest }: any) => {
  const id = `field-${name.replace(/\./g, '-')}`;
  
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field, fieldState }) => (
    <div className="mb-4">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label} <span className="text-red-500">*</span>
      </label>
      <select
            id={id}
            {...field}
            {...rest}
            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              ((fieldState.isTouched || submitAttempted) && get(errors, name)?.type === 'required') 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
      >
        <option value="">Select {label}</option>
            {options.map((option: string) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
          {((fieldState.isTouched || submitAttempted) && get(errors, name)?.type === 'required') && (
            <p className="mt-1 text-sm text-red-600">This field is required</p>
          )}
    </div>
      )}
    />
  );
});

// Set display names for better debugging
InputField.displayName = 'InputField';
SelectField.displayName = 'SelectField';

// Add policyId prop to PolicyForm
export default function PolicyForm({ isUpdate = false, policyId }: { isUpdate?: boolean, policyId?: string | null }) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const toast = useToast();
  const { user, token } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
    reset,
  } = useForm<PolicyFormValues>({ 
    defaultValues: getDefaultValues(), 
    mode: 'onBlur' 
  });

  React.useEffect(() => {
    if (isUpdate && policyId) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_API_ENDPOINT}/getpolicy/${policyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
        .then(res => res.json())
        .then(data => {
          reset(data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isUpdate, policyId, token, reset]);

  // Field arrays
  const { fields: driverFields, append: appendDriver, remove: removeDriver } = useFieldArray<PolicyFormValues>({ 
    control, 
    name: 'drivers' 
  });
  
  const { fields: vehicleFields, append: appendVehicle, remove: removeVehicle } = useFieldArray<PolicyFormValues>({ 
    control, 
    name: 'vehicles' 
  });

  // Watch the arrays to trigger re-validation when they change
  const watchedDrivers = watch('drivers');
  const watchedVehicles = watch('vehicles');

  // Add back per-step validation logic
  const getStepFieldNames = useCallback((step: number) => {
    const currentDrivers = getValues('drivers') || [];
    const currentVehicles = getValues('vehicles') || [];
    switch (step) {
      case 1:
        return [
          'policyNo',
          'policyStatus',
          'policyType',
          'policyEffectiveDate',
          'policyExpirationDate',
        ];
      case 2:
        return [
          'policyHolder.firstName',
          'policyHolder.lastName',
          'policyHolder.address.street',
          'policyHolder.address.city',
          'policyHolder.address.state',
          'policyHolder.address.zip',
        ];
      case 3:
        return currentDrivers.map((_, idx) => [
          `drivers.${idx}.firstName`,
          `drivers.${idx}.lastName`,
          `drivers.${idx}.age`,
          `drivers.${idx}.gender`,
          `drivers.${idx}.maritalStatus`,
          `drivers.${idx}.licenseNumber`,
          `drivers.${idx}.licenseState`,
          `drivers.${idx}.licenseStatus`,
          `drivers.${idx}.licenseEffectiveDate`,
          `drivers.${idx}.licenseExpirationDate`,
          `drivers.${idx}.licenseClass`,
        ]).flat();
      case 4:
        return currentVehicles.map((_, vIdx) => {
          const baseFields = [
            `vehicles.${vIdx}.year`,
            `vehicles.${vIdx}.make`,
            `vehicles.${vIdx}.model`,
            `vehicles.${vIdx}.vin`,
            `vehicles.${vIdx}.usage`,
            `vehicles.${vIdx}.primaryUse`,
            `vehicles.${vIdx}.annualMileage`,
            `vehicles.${vIdx}.ownership`,
            `vehicles.${vIdx}.garagingAddress.street`,
            `vehicles.${vIdx}.garagingAddress.city`,
            `vehicles.${vIdx}.garagingAddress.state`,
            `vehicles.${vIdx}.garagingAddress.zip`,
          ];
          const coverages = getValues(`vehicles.${vIdx}.coverages`) || [];
          const coverageFields = coverages.map((_: any, cIdx: number) => [
            `vehicles.${vIdx}.coverages.${cIdx}.type`,
            `vehicles.${vIdx}.coverages.${cIdx}.limit`,
            `vehicles.${vIdx}.coverages.${cIdx}.deductible`,
          ]).flat();
          return [...baseFields, ...coverageFields];
        }).flat();
      default:
        return [];
    }
  }, [getValues]);

  // Submit handler with better error handling
  const onSubmit = useCallback(async (data: PolicyFormValues) => {
    setSubmitAttempted(true);
    setIsSubmitting(true);
    
    const token = localStorage.getItem('token');
    
    try {
      if (isUpdate && policyId) {
        // Update existing policy
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/updatepolicy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        
          body: JSON.stringify({ user_id: user?.id, policyId, ...data }),
        });
        if (response.ok) {
          toast.success('Policy updated successfully!', { 
            description: 'Your policy has been updated.' 
          });
          setCurrentStep(1);
          setSubmitAttempted(false);
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error('Update failed', { 
            description: errorData.message || 'An error occurred.' 
          });
        }
      } else {
        // Create new policy

        
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/policies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: user?.id, ...data }),
        });
        if (response.ok) {
          toast.success('Policy submitted successfully!', { 
            description: 'Your policy has been submitted.' 
          });
          reset(getDefaultValues());
          setCurrentStep(1);
          setSubmitAttempted(false);
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error('Submission failed', { 
            description: errorData.message || 'An error occurred.' 
          });
        }
      }
    } catch (err: any) {
      toast.error(isUpdate ? 'Update failed' : 'Submission failed', { 
        description: err.message || 'An error occurred.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, reset, isUpdate, policyId, user, token]);

  // Navigation handlers
  const nextStep = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const fieldNames = getStepFieldNames(currentStep);
    const valid = await trigger(fieldNames as any);
    if (valid) {
      setCurrentStep(prev => prev + 1);
      setSubmitAttempted(false);
    } else {
      setSubmitAttempted(true);
    }
  }, [currentStep, trigger, getStepFieldNames]);

  const prevStep = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setCurrentStep(prev => prev - 1);
    setSubmitAttempted(false);
  }, []);

  // Enhanced add handlers to prevent form submission and re-trigger validation
  const handleAddDriver = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    appendDriver({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      maritalStatus: '',
      licenseNumber: '',
      licenseState: '',
      licenseStatus: '',
      licenseEffectiveDate: '',
      licenseExpirationDate: '',
      licenseClass: ''
    });
    
    // Reset submit attempted state when adding new items
    setSubmitAttempted(false);

    // Force validation for the current step after a short delay
    setTimeout(() => {
      // isStepValid(); // This line is no longer needed
    }, 0);
  }, [appendDriver]); // Removed isStepValid from dependencies

  const handleAddVehicle = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    appendVehicle({
      year: '',
      make: '',
      model: '',
      vin: '',
      usage: '',
      primaryUse: '',
      annualMileage: '',
      ownership: '',
      garagingAddress: {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
      coverages: [
        { id: Date.now() + Math.random(), type: 'Liability', limit: '', deductible: '' }
      ]
    });
    
    // Reset submit attempted state when adding new items
    setSubmitAttempted(false);
  }, [appendVehicle]);

  // Enhanced remove handlers
  const handleRemoveDriver = useCallback((index: number) => (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    removeDriver(index);
    setSubmitAttempted(false);

    // Force validation for the current step after a short delay
    setTimeout(() => {
      // isStepValid(); // This line is no longer needed
    }, 0);
  }, [removeDriver]); // Removed isStepValid from dependencies

  const handleRemoveVehicle = useCallback((index: number) => (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    removeVehicle(index);
    setSubmitAttempted(false);
  }, [removeVehicle]);

  // Memoized step components
  // Replace renderStep with always-mounted fields, but hide/show by step
  const Step1 = (
    <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Policy Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField control={control} errors={errors} label="Policy Number" name="policyNo" disabled submitAttempted={submitAttempted} />
        <SelectField control={control} errors={errors} label="Policy Status" name="policyStatus" options={['Active', 'Inactive', 'Expired']} submitAttempted={submitAttempted} />
       
        <SelectField control={control} errors={errors} label="Policy Type" name="policyType" options={['Auto']} disabled submitAttempted={submitAttempted} />
        <div></div>
        <InputField control={control} errors={errors} label="Effective Date" name="policyEffectiveDate" type="date" submitAttempted={submitAttempted} />
      \  <InputField control={control} errors={errors} label="Expiration Date" name="policyExpirationDate" type="date" submitAttempted={submitAttempted} />
      
      </div>
    </div>
  );

  const Step2 = (
    <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Policy Holder</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       
        <InputField control={control} errors={errors} label="First Name" name="policyHolder.firstName" submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="Last Name" name="policyHolder.lastName" submitAttempted={submitAttempted} />
      
        <InputField control={control} errors={errors} label="Street" name="policyHolder.address.street" submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="City" name="policyHolder.address.city" submitAttempted={submitAttempted} />
      
        <InputField control={control} errors={errors} label="State" name="policyHolder.address.state" submitAttempted={submitAttempted} />
        <InputField control={control} errors={errors} label="ZIP Code" name="policyHolder.address.zip" submitAttempted={submitAttempted} />
      </div>
    </div>
  );

  const Step3 = (
    <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Driver Details</h2>
      {driverFields.map((driver: any, idx: number) => (
        <div key={driver.id} className="border rounded-lg p-4 mb-4 relative bg-gray-50">
        
          <h3 className="text-lg font-medium text-gray-800 mb-4">Driver {idx + 1}</h3>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField control={control} errors={errors} label="First Name" name={`drivers.${idx}.firstName`} submitAttempted={submitAttempted} />
            <InputField control={control} errors={errors} label="Last Name" name={`drivers.${idx}.lastName`} submitAttempted={submitAttempted} />
        
            <InputField 
              control={control} 
              errors={errors} 
              label="Age" 
              name={`drivers.${idx}.age`} 
              type="number"
              rules={{ required: true, min: { value: 18, message: 'Driver must be at least 18 years old' } }} 
              submitAttempted={submitAttempted} 
            />
            <SelectField control={control} errors={errors} label="Gender" name={`drivers.${idx}.gender`} options={['Male', 'Female', 'Other']} submitAttempted={submitAttempted} />
       
         <SelectField control={control} errors={errors} label="Marital Status" name={`drivers.${idx}.maritalStatus`} options={['Single', 'Married']} submitAttempted={submitAttempted} />
            <InputField control={control} errors={errors} label="License Number" name={`drivers.${idx}.licenseNumber`} submitAttempted={submitAttempted} />
       
           <InputField control={control} errors={errors} label="License State" name={`drivers.${idx}.licenseState`} submitAttempted={submitAttempted} />
            <SelectField control={control} errors={errors} label="License Status" name={`drivers.${idx}.licenseStatus`} options={['Valid', 'Suspended', 'Expired']} submitAttempted={submitAttempted} />
        
            <InputField control={control} errors={errors} label="License Effective Date" name={`drivers.${idx}.licenseEffectiveDate`} type="date" submitAttempted={submitAttempted} />
            <InputField control={control} errors={errors} label="License Expiration Date" name={`drivers.${idx}.licenseExpirationDate`} type="date" submitAttempted={submitAttempted} />
            <InputField control={control} errors={errors} label="License Class" name={`drivers.${idx}.licenseClass`} submitAttempted={submitAttempted} />
            </div>
          {driverFields.length > 1 && (
            <button type="button" onClick={handleRemoveDriver(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors" title="Remove Driver"><Trash2 size={18} /></button>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddDriver} className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"><PlusCircle className="mr-2" size={18} /> Add Driver</button>
          </div>
  ); 

  const Step4 = (
    <div style={{ display: currentStep === 4 ? 'block' : 'none' }}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Vehicle & Coverage</h2>
      {vehicleFields.map((vehicle: any, vIdx: number) => (
        <VehicleForm key={vehicle.id} control={control} errors={errors} submitAttempted={submitAttempted} vehicleIndex={vIdx} removeVehicle={handleRemoveVehicle} vehicleFieldsLength={vehicleFields.length} />
      ))}
  
      <button type="button" onClick={handleAddVehicle} className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"><PlusCircle className="mr-2" size={18} /> Add Vehicle</button>
    </div> 
  );

  // Show loading state if fetching
  if (loading) return <div className="p-8 text-center text-lg">Loading policy data...</div>;

  return (
    <div className="bg-white">
      {isUpdate}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        onKeyDown={e => {
          if (e.key === 'Enter' && currentStep < steps.length) {
            e.preventDefault();
          }
        }}
      >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
          
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center">
               
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.id}
                           </div>
                   
                     <div className="ml-2">
                      <div className={`text-sm font-medium ${
                        currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                    
                      <div className="text-xs text-gray-400">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="min-h-[500px]">
            {Step1}
            {Step2}
            {Step3}
            {Step4}
          </div>

             <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
              className={`flex items-center px-6 py-2 rounded-md font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
              <ChevronLeft size={16} className="mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
                className="flex items-center px-6 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
                Continue
                <ChevronRight size={16} className="ml-2" />
            </button>
          ) : (
            <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Policy'}
            </button>
          )}
        </div>

          {submitAttempted && Object.keys(errors).length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-600 text-sm font-medium">
                Please correct the following errors:
              </div>
                <ul className="mt-2 text-sm text-red-600 space-y-1">
                {Object.entries(errors).map(([key, error]) => (
                  <li key={key} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      {key.replace(/\./g, ' → ')} is required
                     </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-6">
              <span className="text-red-500">*</span> All fields are required.
          </p>
      </div>
      </form>
    </div>
  );
}