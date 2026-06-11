<?php

namespace App\Http\Controllers;

use App\Models\TelecomGroup;
use Illuminate\Http\Request;
use App\Services\TelecomGroupService;
use App\Http\Requests\StoreTelecomGroupRequest;
use App\Http\Requests\UpdateTelecomGroupRequest;
use App\Http\Resources\TelecomGroupResource;

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
        
        return $this->successResponse(
            TelecomGroupResource::collection($this->telecomGroupService->getAll()),
            'Lista de grupos telecom obtida com sucesso.',
            200
        );
    }

    public function store(StoreTelecomGroupRequest $request)
    {
        $this->authorizeSuperAdmin();
        $group = $this->telecomGroupService->createGroup($request->validated());
        
        return $this->successResponse(
            new TelecomGroupResource($group),
            'Grupo telecom criado com sucesso.',
            201
        );
    }

    public function show(TelecomGroup $telecomGroup)
    {
        $this->authorizeSuperAdmin();
        $groupData = $this->telecomGroupService->getGroup($telecomGroup);
        
        return $this->successResponse(
            new TelecomGroupResource($groupData),
            'Grupo telecom obtido com sucesso.',
            200
        );
    }

    public function update(UpdateTelecomGroupRequest $request, TelecomGroup $telecomGroup)
    {
        $this->authorizeSuperAdmin();
        $updatedGroup = $this->telecomGroupService->updateGroup($telecomGroup, $request->validated());
        
        return $this->successResponse(
            new TelecomGroupResource($updatedGroup),
            'Grupo telecom atualizado com sucesso.',
            200
        );
    }

    public function destroy(TelecomGroup $telecomGroup)
    {
        $this->authorizeSuperAdmin();
        $this->telecomGroupService->deleteGroup($telecomGroup);
        
        return $this->successResponse(
            null,
            'Grupo Telecom removido com sucesso.',
            200
        );
    }
}
