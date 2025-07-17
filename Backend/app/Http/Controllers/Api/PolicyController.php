<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Policy;
use App\Models\PolicyHolder;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\VehicleCoverage;
use App\Models\Address;

class PolicyController extends Controller
{
 public function index()
{  
    return Policy::with(['holder.address', 'drivers', 'vehicles.coverages', 'vehicles.garagingAddress'])->get();
}

public function store(Request $request)
{
    $validated = $request->validate([
        'policyNo' => 'required|unique:policies,policy_no',
        'policyStatus' => 'required',
        'policyType' => 'required',
        'policyEffectiveDate' => 'required|date',
        'policyExpirationDate' => 'required|date',
        'policyHolder' => 'required|array',
        'policyHolder.firstName' => 'required|string',
        'policyHolder.lastName' => 'required|string',
        'policyHolder.address' => 'required|array',
        'policyHolder.address.street' => 'required|string',
        'policyHolder.address.city' => 'required|string',
        'policyHolder.address.state' => 'required|string',
        'policyHolder.address.zip' => 'required|string',
        'drivers' => 'required|array',
        'drivers.*.firstName' => 'required|string',
        'drivers.*.lastName' => 'required|string',
        'drivers.*.age' => 'required|integer',
        'drivers.*.gender' => 'required|string',
        'drivers.*.maritalStatus' => 'required|string',
        'drivers.*.licenseNumber' => 'required|string',
        'drivers.*.licenseState' => 'required|string',
        'drivers.*.licenseStatus' => 'required|string',
        'drivers.*.licenseEffectiveDate' => 'required|date',
        'drivers.*.licenseExpirationDate' => 'required|date',
        'drivers.*.licenseClass' => 'required|string',
        'vehicles' => 'required|array',
        'vehicles.*.year' => 'required|integer',
        'vehicles.*.make' => 'required|string',
        'vehicles.*.model' => 'required|string',
        'vehicles.*.vin' => 'required|string',
        'vehicles.*.usage' => 'required|string',
        'vehicles.*.primaryUse' => 'required|string',
        'vehicles.*.annualMileage' => 'required|integer',
        'vehicles.*.ownership' => 'required|string',
        'vehicles.*.garagingAddress' => 'required|array',
        'vehicles.*.garagingAddress.street' => 'required|string',
        'vehicles.*.garagingAddress.city' => 'required|string',
        'vehicles.*.garagingAddress.state' => 'required|string',
        'vehicles.*.garagingAddress.zip' => 'required|string',
        'vehicles.*.coverages' => 'required|array',
        'vehicles.*.coverages.*.type' => 'required|string',
        'vehicles.*.coverages.*.limit' => 'required|string',
        'vehicles.*.coverages.*.deductible' => 'required|string',
    ]);

    // Create Policy
    $policy = Policy::create([
        'policy_no' => $validated['policyNo'],
        'policy_status' => $validated['policyStatus'],
        'policy_type' => $validated['policyType'],
        'policy_effective_date' => $validated['policyEffectiveDate'],
        'policy_expiration_date' => $validated['policyExpirationDate'],
    ]);

    // Create PolicyHolder Address
    $holderAddress = Address::create($validated['policyHolder']['address']);
    // Create PolicyHolder
    $policyHolder = PolicyHolder::create([
        'policy_id' => $policy->id,
        'first_name' => $validated['policyHolder']['firstName'],
        'last_name' => $validated['policyHolder']['lastName'],
        'address_id' => $holderAddress->id,
    ]);

    // Create Drivers
    foreach ($validated['drivers'] as $driverData) {
        Driver::create([
            'policy_id' => $policy->id,
            'first_name' => $driverData['firstName'],
            'last_name' => $driverData['lastName'],
            'age' => $driverData['age'],
            'gender' => $driverData['gender'],
            'marital_status' => $driverData['maritalStatus'],
            'license_number' => $driverData['licenseNumber'],
            'license_state' => $driverData['licenseState'],
            'license_status' => $driverData['licenseStatus'],
            'license_effective_date' => $driverData['licenseEffectiveDate'],
            'license_expiration_date' => $driverData['licenseExpirationDate'],
            'license_class' => $driverData['licenseClass'],
        ]);
    }

    // Create Vehicles and their coverages
    foreach ($validated['vehicles'] as $vehicleData) {
        // Create Garaging Address
        $garagingAddress = Address::create($vehicleData['garagingAddress']);
        // Create Vehicle
        $vehicle = Vehicle::create([
            'policy_id' => $policy->id,
            'year' => $vehicleData['year'],
            'make' => $vehicleData['make'],
            'model' => $vehicleData['model'],
            'vin' => $vehicleData['vin'],
            'usage' => $vehicleData['usage'],
            'primary_use' => $vehicleData['primaryUse'],
            'annual_mileage' => $vehicleData['annualMileage'],
            'ownership' => $vehicleData['ownership'],
            'garaging_address_id' => $garagingAddress->id,
        ]);
        // Create Coverages
        foreach ($vehicleData['coverages'] as $coverageData) {
            VehicleCoverage::create([
                'vehicle_id' => $vehicle->id,
                'type' => $coverageData['type'],
                'limit' => $coverageData['limit'],
                'deductible' => $coverageData['deductible'],
            ]);
        }
    }

    // Return the full policy with relationships
    return Policy::with(['holder.address', 'drivers', 'vehicles.coverages', 'vehicles.garagingAddress'])->find($policy->id);
}
}
