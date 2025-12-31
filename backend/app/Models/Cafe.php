<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cafe extends Model
{
    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'description',
        'open_hours',
        'wifi_status',
        'socket_status',
        'parking_info',
        'toilet_info',
        'musholla_status',
        'tags',
    ];

    protected $casts = [
        'musholla_status' => 'boolean',
        'tags' => 'array',
    ];

    public function photos(): HasMany
    {
        return $this->hasMany(CafePhoto::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
