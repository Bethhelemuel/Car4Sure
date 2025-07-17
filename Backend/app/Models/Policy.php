<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    protected $fillable = [
        'policy_no',
        'policy_status',
        'policy_type',
        'policy_effective_date',
        'policy_expiration_date',
    ];

    public function holder() {
        return $this->hasOne(PolicyHolder::class);
    }

    public function drivers() {
        return $this->hasMany(Driver::class);
    }

    public function vehicles() {
        return $this->hasMany(Vehicle::class);
    }
}

