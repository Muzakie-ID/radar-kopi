<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cafe;
use Illuminate\Http\Request;

class CafeController extends Controller
{
    public function index()
    {
        $cafes = Cafe::with('photos')->get();
        
        return response()->json([
            'success' => true,
            'data' => $cafes
        ]);
    }

    public function show($id)
    {
        $cafe = Cafe::with(['photos', 'reviews' => function ($query) {
            $query->where('is_approved', true)->orderBy('created_at', 'desc');
        }])->find($id);

        if (!$cafe) {
            return response()->json([
                'success' => false,
                'message' => 'Cafe not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $cafe
        ]);
    }

    public function storeReview(Request $request, $id)
    {
        $request->validate([
            'guest_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
        ]);

        $cafe = Cafe::find($id);
        if (!$cafe) {
            return response()->json(['success' => false, 'message' => 'Cafe not found'], 404);
        }

        $review = $cafe->reviews()->create([
            'guest_name' => $request->guest_name,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully! Waiting for approval.',
            'data' => $review
        ], 201);
    }
}
