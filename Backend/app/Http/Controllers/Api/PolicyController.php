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
            'user_id' => 'required|integer|exists:users,id',
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

        $policy = Policy::create([
            'policy_no' => $validated['policyNo'],
            'policy_status' => $validated['policyStatus'],
            'policy_type' => $validated['policyType'],
            'policy_effective_date' => $validated['policyEffectiveDate'],
            'policy_expiration_date' => $validated['policyExpirationDate'],
            'user_id' => $validated['user_id'],
        ]);

        $holderAddress = Address::create($validated['policyHolder']['address']);
        $policyHolder = PolicyHolder::create([
            'policy_id' => $policy->id,
            'first_name' => $validated['policyHolder']['firstName'],
            'last_name' => $validated['policyHolder']['lastName'],
            'address_id' => $holderAddress->id,
        ]);

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

        foreach ($validated['vehicles'] as $vehicleData) {
            $garagingAddress = Address::create($vehicleData['garagingAddress']);
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
            foreach ($vehicleData['coverages'] as $coverageData) {
                VehicleCoverage::create([
                    'vehicle_id' => $vehicle->id,
                    'type' => $coverageData['type'],
                    'limit' => $coverageData['limit'],
                    'deductible' => $coverageData['deductible'],
                ]);
            }
        }

        return Policy::with(['holder.address', 'drivers', 'vehicles.coverages', 'vehicles.garagingAddress'])->find($policy->id);
    }

    public function getAllPolicies(Request $request)
    {
        $validated = $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
            'search' => 'nullable|string|max:255',
            'sort' => 'nullable|string|in:created_at,policy_no,policy_effective_date,policy_status',
            'sortDir' => 'nullable|string|in:asc,desc',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $page = $validated['page'] ?? 1;
        $search = $validated['search'] ?? '';
        $sort = $validated['sort'] ?? 'created_at';
        $sortDir = strtolower($validated['sortDir'] ?? 'desc') === 'asc' ? 'asc' : 'desc';
        $userId = $validated['user_id'];

        $query = Policy::with(['holder', 'vehicles']);
        $query = $query->where('user_id', $userId);

        if ($search) {
            $searchTerm = '%' . trim($search) . '%';
            $query = $query->where(function($q) use ($searchTerm) {
                $q->where('policy_no', 'like', $searchTerm)
                  ->orWhere('policy_status', 'like', $searchTerm)
                  ->orWhere('policy_type', 'like', $searchTerm)
                  ->orWhere('policy_effective_date', 'like', $searchTerm)
                  ->orWhere('policy_expiration_date', 'like', $searchTerm)
                  ->orWhere('created_at', 'like', $searchTerm)
                  ->orWhereHas('holder', function($qh) use ($searchTerm) {
                      $qh->where('first_name', 'like', $searchTerm)
                         ->orWhere('last_name', 'like', $searchTerm)
                         ->orWhereRaw("CONCAT(first_name, ' ', last_name) like ?", [$searchTerm]);
                  })
                  ->orWhereHas('vehicles', function($qv) use ($searchTerm) {
                      $qv->where('make', 'like', $searchTerm)
                         ->orWhere('model', 'like', $searchTerm)
                         ;
                  });
            });
        }

        $total = $query->count();
        $policies = $query->orderBy($sort, $sortDir)
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $data = $policies->map(function($policy) {
            $holderName = $policy->holder ? ($policy->holder->first_name . ' ' . $policy->holder->last_name) : 'N/A';
            $vehicle = 'N/A';
            if ($policy->vehicles && count($policy->vehicles) > 0) {
                $firstVehicle = $policy->vehicles[0];
                $vehicle = trim(($firstVehicle->make ?? '') . ' ' . ($firstVehicle->model ?? ''));
                if ($vehicle === '') $vehicle = 'N/A';
            }
            return [
                'policyId' => $policy->id,
                'id' => 'POL' . str_pad($policy->id, 3, '0', STR_PAD_LEFT),
                'policyNumber' => $policy->policy_no,
                'policyType' => $policy->policy_type,
                'status' => $policy->policy_status,
                'effectiveDate' => $policy->policy_effective_date,
                'expirationDate' => $policy->policy_expiration_date,
                'holderName' => $holderName,
                'vehicle' => $vehicle,
                'createdAt' => $policy->created_at,
            ];
        });

        return response()->json([
            'count' => $total,
            'data' => $data,
            'per_page' => $perPage,
            'page' => $page
        ]);
    }

    public function getPolicy($id)
    {
        if (!is_numeric($id) || $id <= 0) {
            return response()->json(['message' => 'Invalid policy ID.'], 400);
        }

        $policy = Policy::with([
            'holder.address',
            'drivers',
            'vehicles.coverages',
            'vehicles.garagingAddress'
        ])->find($id);

        if (!$policy) {
            return response()->json(['message' => 'Policy not found.'], 404);
        }

        $result = [
            'policyNo' => $policy->policy_no,
            'policyStatus' => $policy->policy_status,
            'policyType' => $policy->policy_type,
            'policyEffectiveDate' => $policy->policy_effective_date,
            'policyExpirationDate' => $policy->policy_expiration_date,
            'policyHolder' => $policy->holder ? [
                'firstName' => $policy->holder->first_name,
                'lastName' => $policy->holder->last_name,
                'address' => $policy->holder->address ? [
                    'street' => $policy->holder->address->street,
                    'city' => $policy->holder->address->city,
                    'state' => $policy->holder->address->state,
                    'zip' => $policy->holder->address->zip,
                ] : null,
            ] : null,
            'drivers' => $policy->drivers->map(function($driver) {
                return [
                    'firstName' => $driver->first_name,
                    'lastName' => $driver->last_name,
                    'age' => $driver->age,
                    'gender' => $driver->gender,
                    'maritalStatus' => $driver->marital_status,
                    'licenseNumber' => $driver->license_number,
                    'licenseState' => $driver->license_state,
                    'licenseStatus' => $driver->license_status,
                    'licenseEffectiveDate' => $driver->license_effective_date,
                    'licenseExpirationDate' => $driver->license_expiration_date,
                    'licenseClass' => $driver->license_class,
                ];
            })->toArray(),
            'vehicles' => $policy->vehicles->map(function($vehicle) {
                return [
                    'year' => $vehicle->year,
                    'make' => $vehicle->make,
                    'model' => $vehicle->model,
                    'vin' => $vehicle->vin,
                    'usage' => $vehicle->usage,
                    'primaryUse' => $vehicle->primary_use,
                    'annualMileage' => $vehicle->annual_mileage,
                    'ownership' => $vehicle->ownership,
                    'garagingAddress' => $vehicle->garagingAddress ? [
                        'street' => $vehicle->garagingAddress->street,
                        'city' => $vehicle->garagingAddress->city,
                        'state' => $vehicle->garagingAddress->state,
                        'zip' => $vehicle->garagingAddress->zip,
                    ] : null,
                    'coverages' => $vehicle->coverages->map(function($coverage) {
                        return [
                            'type' => $coverage->type,
                            'limit' => $coverage->limit,
                            'deductible' => $coverage->deductible,
                        ];
                    })->toArray(),
                ];
            })->toArray(),
        ];

        return response()->json($result);
    }

    public function updatePolicy(Request $request)
    {
        $validated = $request->validate([
            'policyId' => 'required|integer|exists:policies,id',
            'policyNo' => 'required',
            'policyStatus' => 'required',
            'policyType' => 'required',
            'policyEffectiveDate' => 'required|date',
            'policyExpirationDate' => 'required|date',
            'user_id' => 'required|integer|exists:users,id',
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

        $policy = Policy::with(['holder.address', 'drivers', 'vehicles.coverages', 'vehicles.garagingAddress'])->find($validated['policyId']);
        if (!$policy) {
            return response()->json(['message' => 'Policy not found.'], 404);
        }

        $policy->update([
            'policy_no' => $validated['policyNo'],
            'policy_status' => $validated['policyStatus'],
            'policy_type' => $validated['policyType'],
            'policy_effective_date' => $validated['policyEffectiveDate'],
            'policy_expiration_date' => $validated['policyExpirationDate'],
            'user_id' => $validated['user_id'],
        ]);

        if ($policy->holder) {
            $policy->holder->update([
                'first_name' => $validated['policyHolder']['firstName'],
                'last_name' => $validated['policyHolder']['lastName'],
            ]);
            if ($policy->holder->address) {
                $policy->holder->address->update($validated['policyHolder']['address']);
            } else {
                $address = Address::create($validated['policyHolder']['address']);
                $policy->holder->address_id = $address->id;
                $policy->holder->save();
            }
        }

        foreach ($policy->drivers as $driver) {
            $driver->delete();
        }
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

        foreach ($policy->vehicles as $vehicle) {
            foreach ($vehicle->coverages as $coverage) {
                $coverage->delete();
            }
            if ($vehicle->garagingAddress) {
                $vehicle->garagingAddress->delete();
            }
            $vehicle->delete();
        }
        foreach ($validated['vehicles'] as $vehicleData) {
            $garagingAddress = Address::create($vehicleData['garagingAddress']);
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
            foreach ($vehicleData['coverages'] as $coverageData) {
                VehicleCoverage::create([
                    'vehicle_id' => $vehicle->id,
                    'type' => $coverageData['type'],
                    'limit' => $coverageData['limit'],
                    'deductible' => $coverageData['deductible'],
                ]);
            }
        }

        return response()->json(['message' => 'Policy updated successfully.']);
    }

    public function deleteById($id)
    {
        if (!is_numeric($id) || $id <= 0) {
            return response()->json(['message' => 'Invalid policy ID.'], 400);
        }

        $policy = Policy::find($id);
        if (!$policy) {
            return response()->json(['message' => 'Policy not found.'], 404);
        }

        if ($policy->holder) {
            if ($policy->holder->address) {
                $policy->holder->address->delete();
            }
            $policy->holder->delete();
        }

        foreach ($policy->drivers as $driver) {
            $driver->delete();
        }

        foreach ($policy->vehicles as $vehicle) {
            foreach ($vehicle->coverages as $coverage) {
                $coverage->delete();
            }
            if ($vehicle->garagingAddress) {
                $vehicle->garagingAddress->delete();
            }
            $vehicle->delete();
        }

        $policy->delete();

        return response()->json(['message' => 'Policy and all associated data deleted successfully.']);
    }

    public function destroy($id)
    {
        if (!is_numeric($id) || $id <= 0) {
            return response()->json(['message' => 'Invalid policy ID.'], 400);
        }

        return $this->deleteById($id);
    }

    public function dashboard(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);
        $userId = $validated['user_id'];

        $policyIds = Policy::where('user_id', $userId)->pluck('id');

        $totalPolicies = $policyIds->count();

        $statusCounts = Policy::where('user_id', $userId)
            ->selectRaw('policy_status, COUNT(*) as count')
            ->groupBy('policy_status')
            ->pluck('count', 'policy_status');

        $totalDrivers = \App\Models\Driver::whereIn('policy_id', $policyIds)->count();
        $totalVehicles = \App\Models\Vehicle::whereIn('policy_id', $policyIds)->count();
        $policyHolderAddressIds = \App\Models\PolicyHolder::whereIn('policy_id', $policyIds)->pluck('address_id')->filter();
        $vehicleGaragingAddressIds = \App\Models\Vehicle::whereIn('policy_id', $policyIds)->pluck('garaging_address_id')->filter();
        $totalAddresses = $policyHolderAddressIds->merge($vehicleGaragingAddressIds)->unique()->count();

        return response()->json([
            'totalPolicies' => $totalPolicies,
            'policiesByStatus' => $statusCounts,
            'totalDrivers' => $totalDrivers,
            'totalVehicles' => $totalVehicles,
            'totalAddresses' => $totalAddresses,
        ]);
    }
}
