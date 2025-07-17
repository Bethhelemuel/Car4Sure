<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Policy;
use App\Models\Address;

class AddressController extends Controller
{
    public function getAllAddresses(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $policies = Policy::with(['holder.address', 'vehicles.garagingAddress'])
            ->where('user_id', $validated['user_id'])
            ->get();
        $addresses = [];
        foreach ($policies as $policy) {
            if ($policy->holder && $policy->holder->address) {
                $addresses[] = [
                    'policyNumber' => $policy->policy_no,
                    'type' => 'PolicyHolder',
                    'firstName' => $policy->holder->first_name,
                    'lastName' => $policy->holder->last_name,
                    'street' => $policy->holder->address->street,
                    'city' => $policy->holder->address->city,
                    'state' => $policy->holder->address->state,
                    'zip' => $policy->holder->address->zip,
                ];
            }
            foreach ($policy->vehicles as $vehicle) {
                if ($vehicle->garagingAddress) {
                    $addresses[] = [
                        'policyNumber' => $policy->policy_no,
                        'type' => 'Vehicle',
                        'vehicleMake' => $vehicle->make,
                        'vehicleModel' => $vehicle->model,
                        'street' => $vehicle->garagingAddress->street,
                        'city' => $vehicle->garagingAddress->city,
                        'state' => $vehicle->garagingAddress->state,
                        'zip' => $vehicle->garagingAddress->zip,
                    ];
                }
            }
        }
        return response()->json($addresses);
    }
} 