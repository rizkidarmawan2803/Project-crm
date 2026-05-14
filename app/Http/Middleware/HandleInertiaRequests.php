<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [

            'auth' => [
                'user' => $request->user()
                    ? [
                        'id'         => $request->user()->id,
                        'first_name' => $request->user()->first_name,
                        'last_name'  => $request->user()->last_name,
                        'email'      => $request->user()->email,
                        'is_admin'   => $request->user()->is_admin,
                    ]
                    : null,
            ],

        ]);
    }
}