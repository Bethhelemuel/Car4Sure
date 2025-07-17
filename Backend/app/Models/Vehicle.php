<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'policy_id',
        'year',
        'make',
        'model',
        'vin',
        'usage',
        'primary_use',
        'annual_mileage',
        'ownership',
        'garaging_address_id'
    ];

    public function policy() {
        return $this->belongsTo(Policy::class);
    }

    public function coverages() {
        return $this->hasMany(VehicleCoverage::class);
    }

    public function garagingAddress() {
        return $this->belongsTo(Address::class, 'garaging_address_id');
    }
}

