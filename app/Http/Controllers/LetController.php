<?php

namespace App\Http\Controllers;

use App\Models\Let;
use Illuminate\Http\Request;

class LetController extends Controller
{
    public function index()
    {
        return Let::all();
    }

    public function store(Request $request)
    {
        $let = Let::create($request->all());
        return response()->json($let, 201);
    }

    public function show($id)
    {
        $let = Let::find($id);
        if (!$let) {
            return response()->json(['error' => 'Let nije pronađen'], 404);
        }
        return $let;
    }

    public function update(Request $request, $id)
    {
        $let = Let::find($id);
        if (!$let) {
            return response()->json(['error' => 'Let nije pronađen'], 404);
        }
        $let->update($request->all());
        return response()->json($let);
    }

    public function destroy($id)
    {
        $let = Let::find($id);
        if (!$let) {
            return response()->json(['error' => 'Let nije pronađen'], 404);
        }
        $let->delete();
        return response()->json(['message' => 'Let obrisan']);
    }
}