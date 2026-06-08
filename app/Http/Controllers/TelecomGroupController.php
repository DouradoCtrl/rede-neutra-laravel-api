<?php

namespace App\Http\Controllers;

use App\Models\TelecomGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TelecomGroupController extends Controller
{
    /**
     * Valida se o usuário autenticado é um Super Administrador da Kayros Link.
     * Caso contrário, bloqueia o acesso com um erro 403 (Forbidden).
     */
    private function authorizeSuperAdmin()
    {
        abort_if(
            auth()->user()->role !== 'super_admin', 
            403, 
            'Acesso Negado: Apenas a Kayros Link (Super Admin) pode acessar o gerenciamento de Grupos Telecom.'
        );
    }

    public function index()
    {
        $this->authorizeSuperAdmin();
        return response()->json(TelecomGroup::all());
    }

    public function store(Request $request)
    {
        $this->authorizeSuperAdmin();

        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:telecom_groups',
            'active' => 'boolean'
        ]);

        $group = TelecomGroup::create([
            'name' => $request->name,
            'slug' => $request->slug ?? Str::slug($request->name),
            'active' => $request->active ?? true,
        ]);

        return response()->json($group, 201);
    }

    public function show(TelecomGroup $telecomGroup)
    {
        $this->authorizeSuperAdmin();
        // Opcional: carrega os usuários associados a esse grupo
        return response()->json($telecomGroup->load('users'));
    }

    public function update(Request $request, TelecomGroup $telecomGroup)
    {
        $this->authorizeSuperAdmin();

        $request->validate([
            'name' => 'string|max:255',
            'slug' => 'string|max:255|unique:telecom_groups,slug,' . $telecomGroup->id,
            'active' => 'boolean'
        ]);

        if ($request->has('name')) $telecomGroup->name = $request->name;
        if ($request->has('slug')) $telecomGroup->slug = $request->slug;
        if ($request->has('active')) $telecomGroup->active = $request->active;
        $telecomGroup->save();

        return response()->json($telecomGroup);
    }

    public function destroy(TelecomGroup $telecomGroup)
    {
        $this->authorizeSuperAdmin();
        $telecomGroup->delete();
        return response()->json(['message' => 'Grupo Telecom removido com sucesso.']);
    }
}
