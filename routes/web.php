<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Route untuk Guru & Pembina
    Route::post('/grades/update', [DashboardController::class, 'updateGrade'])->name('grades.update');
    Route::post('/talent/update', [DashboardController::class, 'updateTalent'])->name('talent.update');
    Route::delete('/pembina/student/remove/{studentId}', [DashboardController::class, 'removeStudentFromTalent'])->name('pembina.removeStudent');

    // Route Khusus Admin User Management
    Route::post('/admin/user/save', [DashboardController::class, 'saveUser'])->name('admin.saveUser');
    Route::delete('/admin/user/delete/{id}', [DashboardController::class, 'deleteUser'])->name('admin.deleteUser');

    // Route Khusus Admin Schedule Management (BARU DITAMBAHKAN)
    Route::post('/admin/schedule/save', [DashboardController::class, 'saveSchedule'])->name('admin.saveSchedule');
    Route::delete('/admin/schedule/delete/{id}', [DashboardController::class, 'deleteSchedule'])->name('admin.deleteSchedule');
});

require __DIR__.'/auth.php';