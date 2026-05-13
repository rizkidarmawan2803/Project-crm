<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ManajemenPenggunaController extends Controller
{
    public function index()
    {
        return Inertia::render('ManajemenPengguna');
    }
}