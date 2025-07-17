<?php


use App\Http\Controllers\Api\PolicyController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\VehicleCoverageController; 
use App\Http\Controllers\Api\AuthController;

// Authentication routes (public)
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']); 

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('getallpolicies', [PolicyController::class, 'getAllPolicies']); 
    Route::delete('policies/delete/{id}', [PolicyController::class, 'deleteById']); 
    Route::get('getpolicy/{id}', [PolicyController::class, 'getPolicy']); 
    Route::post('updatepolicy', [PolicyController::class, 'updatePolicy']); 
    Route::post('getallvehicles', [VehicleController::class, 'getAllVehicles']);
    Route::post('getalldrivers', [DriverController::class, 'getAllDrivers']);
    Route::post('getalladdresses', [\App\Http\Controllers\Api\AddressController::class, 'getAllAddresses']); 
    Route::post('dashboard', [PolicyController::class, 'dashboard']);
    
    // Resource routes
    Route::apiResource('policies', PolicyController::class);
    Route::apiResource('drivers', DriverController::class); 
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('vehicle-coverages', VehicleCoverageController::class); 
}); 