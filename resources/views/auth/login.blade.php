<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Disty CRM</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        .font-manrope { font-family: 'Manrope', sans-serif; }
    </style>
</head>
<body class="bg-[#F8FAFC] font-manrope antialiased min-h-screen flex flex-col lg:flex-row">
    
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
             alt="Skyscraper" 
             class="absolute inset-0 h-full w-full object-cover">
        
        <div class="absolute inset-0 bg-gradient-to-t from-[#004CCA]/90 via-[#004CCA]/40 to-transparent"></div>
        
        <div class="relative z-10 flex flex-col justify-end p-16 h-full text-white">
            <h1 class="text-5xl font-extrabold mb-4 leading-tight text-white">Optimalkan Bisnis Anda</h1>
            <p class="text-blue-50 text-xl opacity-90 max-w-lg leading-relaxed">
                Kelola database pelanggan dan tingkatkan efisiensi penjualan Anda dalam satu platform profesional yang terintegrasi.
            </p>
        </div>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        
        <div class="mb-8">
            <img src="{{ asset('images/logo.png') }}" alt="Logo Disty CRM" class="h-20 w-auto">
        </div>

        <div class="bg-white w-full max-w-xl p-10 md:p-14 rounded-[10px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] border border-slate-100">
            
            <div class="mb-10 text-center">
                <h2 class="text-4xl font-extrabold text-slate-900 mb-2">Selamat Datang</h2>
                <p class="text-slate-500 text-lg">Silakan masuk ke akun Anda untuk melanjutkan.</p>
            </div>

            <form action="#" method="POST" class="space-y-6">
                @csrf
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Alamat Email</label>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors group-focus-within:text-[#004CCA]">
                            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <input type="email" name="email" required 
                            class="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[10px] focus:ring-4 focus:ring-blue-100 focus:border-[#004CCA] focus:bg-white transition-all placeholder-slate-400 text-slate-700" 
                            placeholder="nama@perusahaan.com">
                    </div>
                </div>

                <div>
                    <div class="flex justify-between mb-2 ml-1">
                        <label class="block text-sm font-bold text-slate-700 uppercase tracking-wider">Kata Sandi</label>
                        <a href="#" class="text-sm font-bold text-[#004CCA] hover:text-[#003da3] transition-colors">Lupa Kata Sandi?</a>
                    </div>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none group-focus-within:text-[#004CCA]">
                            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                        </div>
                        <input type="password" name="password" required 
                            class="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-[10px] focus:ring-4 focus:ring-blue-100 focus:border-[#004CCA] focus:bg-white transition-all placeholder-slate-400 text-slate-700" 
                            placeholder="••••••••">
                        <div class="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-slate-400 hover:text-[#004CCA]">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="flex items-center ml-1">
                    <input type="checkbox" id="remember" class="w-5 h-5 text-[#004CCA] border-slate-300 rounded focus:ring-[#004CCA] cursor-pointer">
                    <label for="remember" class="ml-3 text-base font-medium text-slate-600 cursor-pointer">Ingat Saya</label>
                </div>

                <button type="submit" 
                    class="w-full py-4 bg-[#004CCA] hover:bg-[#003da3] text-white font-extrabold text-xl rounded-[10px] shadow-xl shadow-[#004CCA]/20 transform transition-all active:scale-[0.98] hover:-translate-y-0.5">
                    Masuk
                </button>
            </form>

            <p class="mt-12 text-center text-slate-500 text-lg">
                Belum punya akun? <a href="#" class="font-black text-[#004CCA] hover:underline decoration-2">Hubungi Admin</a>
            </p>
        </div>
    </div>

</body>
</html>