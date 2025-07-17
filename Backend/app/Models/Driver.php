<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = [
        'policy_id',
        'first_name',
        'last_name',
        'age',
        'gender',
        'marital_status',
        'license_number',
        'license_state',
        'license_status',
        'license_effective_date',
        'license_expiration_date',
        'license_class'
    ];

    public function policy() {
        return $this->belongsTo(Policy::class);
    }
}

