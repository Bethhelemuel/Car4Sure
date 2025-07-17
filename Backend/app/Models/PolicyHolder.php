<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PolicyHolder extends Model
{
    protected $fillable = ['policy_id', 'first_name', 'last_name', 'address_id'];

    public function policy() {
        return $this->belongsTo(Policy::class);
    }

    public function address() {
        return $this->belongsTo(Address::class);
    }
}