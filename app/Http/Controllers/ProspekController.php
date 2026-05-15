<?php

namespace App\Http\Controllers;

use App\Models\LeadClient;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ProspekController extends Controller
{
    public function index(): Response
    {
        $sales = User::where('is_admin', 0)
            ->get(['id', 'first_name', 'last_name']);

        return Inertia::render('Prospek/Index', [
            'sales' => $sales,
        ]);
    }
}