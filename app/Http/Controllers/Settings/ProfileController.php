<?php
namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log; 
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());
        
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }
        
        $request->user()->save();
        
        return to_route('profile.edit');
    }

    /**
     * Update user's avatar.
     */
    public function updateAvatar(Request $request)
    {
        
        // Validation explicite avec messages d'erreur personnalisés
        $request->validate([
            'avatar' => [
                'required',
                'file',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:2048'
            ]
        ], [
            'avatar.required' => 'Veuillez sélectionner une image.',
            'avatar.image' => 'Le fichier doit être une image.',
            'avatar.mimes' => 'L\'image doit être au format JPG, PNG ou GIF.',
            'avatar.max' => 'L\'image ne doit pas dépasser 2Mo.'
        ]);
        
        try {
            // Supprimer l'ancien avatar s'il existe
            if ($request->user()->avatar) {
                Storage::disk('public')->delete($request->user()->avatar);
            }
            
            // Stocker le nouvel avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            
            // Mettre à jour l'utilisateur
            $request->user()->update([
                'avatar' => $path,
            ]);
            
            return redirect()->back();
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de l\'avatar: ' . $e->getMessage());
            return back()->withErrors(['avatar' => 'Erreur lors de la mise à jour: ' . $e->getMessage()]);
        }
    }
    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }
        
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}