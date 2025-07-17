<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleCoverage extends Model
{
    protected $fillable = ['vehicle_id', 'type', 'limit', 'deductible'];

    public function vehicle() {
        return $this->belongsTo(Vehicle::class);
    }
}
