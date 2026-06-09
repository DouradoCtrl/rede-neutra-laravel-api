<?php

namespace App\Http\Controllers;

use App\Models\TelecomGroup;
use Illuminate\Http\Request;
use App\Services\TelecomGroupService;

class TelecomGroupController extends Controller
{
    public function __construct(private TelecomGroupService $telecomGroupService)
    {
    }

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
        return response()->json($this->telecomGroupService->getAll(), 200);
    }

    public function store(Request $request)
    {
        $this->authorizeSuperAdmin();
        $group = $this->telecomGroupService->createGroup($request->all());
        return response()->json($group, 201);
    }

    public function show(TelecomGroup $telecomGroup)
    {
        $this->authorizeSuperAdmin();
        return response()->json($this->telecomGroupService->getGroup($telecomGroup), 200);
    }

    public function update(Request $request, TelecomGroup $telecomGroup)
    {
        $this->authorizeSuperAdmin();
        $updatedGroup = $this->telecomGroupService->updateGroup($telecomGroup, $request->all());
        return response()->json($updatedGroup, 200);
    }

    public function destroy(TelecomGroup $telecomGroup)
    {
        $this->authorizeSuperAdmin();
        $this->telecomGroupService->deleteGroup($telecomGroup);
        return response()->json(['message' => 'Grupo Telecom removido com sucesso.'], 200);
    }
}
