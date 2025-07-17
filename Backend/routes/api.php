<?php


use App\Http\Controllers\Api\PolicyController;
use App\Http\Controllers\Api\PolicyHolderController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\VehicleCoverageController; 
use App\Http\Controllers\Api\AuthController;

Route::apiResource('policies', PolicyController::class);
Route::apiResource('policy-holders', PolicyHolderController::class);
Route::apiResource('drivers', DriverController::class); 
Route::apiResource('vehicles', VehicleController::class);
Route::apiResource('vehicle-coverages', VehicleCoverageController::class);

// Authentication routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']); 