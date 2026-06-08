<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', User::class);
        
        // O global scope (Trait) fará a mágica: 
        // - Se Kayros: retorna todos.
        // - Se Parceiro: retorna apenas os do próprio grupo.
        return response()->json(User::with('telecomGroup')->get());
    }

    public function store(Request $request)
    {
        Gate::authorize('create', User::class);

        $isSuperAdmin = auth()->user()->role === 'super_admin';

        // Prevenção de escalonamento de privilégio
        $allowedRoles = $isSuperAdmin 
            ? ['super_admin', 'admin', 'user'] 
            : ['admin', 'user'];

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in($allowedRoles)],
            // Apenas super_admin pode definir o grupo de forma manual.
            // Para parceiros, isso é estritamente proibido (pois é setado via Trait event).
            'telecom_group_id' => $isSuperAdmin ? 'nullable|exists:telecom_groups,id' : 'prohibited'
        ]);

        $validated['password'] = Hash::make($validated['password']);
        
        $user = User::create($validated);

        return response()->json($user->load('telecomGroup'), 201);
    }

    public function show(User $user)
    {
        Gate::authorize('view', $user);
        return response()->json($user->load('telecomGroup'));
    }

    public function update(Request $request, User $user)
    {
        Gate::authorize('update', $user);

        $isSuperAdmin = auth()->user()->role === 'super_admin';
        $allowedRoles = $isSuperAdmin ? ['super_admin', 'admin', 'user'] : ['admin', 'user'];

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'role' => ['sometimes', Rule::in($allowedRoles)],
            'telecom_group_id' => $isSuperAdmin ? 'nullable|exists:telecom_groups,id' : 'prohibited'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user->fresh('telecomGroup'));
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);
        $user->delete();
        return response()->json(['message' => 'Usuário deletado com sucesso.']);
    }
}
