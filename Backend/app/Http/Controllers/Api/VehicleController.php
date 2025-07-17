<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }

    public function getAllVehicles(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $vehicles = \App\Models\Vehicle::with('policy')
            ->whereHas('policy', function($q) use ($validated) {
                $q->where('user_id', $validated['user_id']);
            })
            ->get();
        $data = $vehicles->map(function($vehicle) {
            return [
                'policyNumber' => $vehicle->policy ? $vehicle->policy->policy_no : null,
                'year' => $vehicle->year,
                'make' => $vehicle->make,
                'model' => $vehicle->model,
                'vin' => $vehicle->vin,
                'usage' => $vehicle->usage,
                'primaryUse' => $vehicle->primary_use,
                'annualMileage' => $vehicle->annual_mileage,
                'ownership' => $vehicle->ownership,
            ];
        });
        return response()->json($data);
    }
}
