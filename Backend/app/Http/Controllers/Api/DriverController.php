<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DriverController extends Controller
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

    public function getAllDrivers(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $drivers = \App\Models\Driver::with('policy')
            ->whereHas('policy', function($q) use ($validated) {
                $q->where('user_id', $validated['user_id']);
            })
            ->get();
        $data = $drivers->map(function($driver) {
            return [
                'policyNumber' => $driver->policy ? $driver->policy->policy_no : null,
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
        });
        return response()->json($data);
    }
}
