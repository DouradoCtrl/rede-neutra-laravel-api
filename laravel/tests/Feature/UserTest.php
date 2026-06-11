<?php

use App\Models\User;
use App\Models\TelecomGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('permite que super_admin liste todos os usuários de qualquer grupo', function () {
    $grupoA = TelecomGroup::factory()->create();
    $grupoB = TelecomGroup::factory()->create();

    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $adminA = User::factory()->create(['role' => 'admin', 'telecom_group_id' => $grupoA->id]);
    $adminB = User::factory()->create(['role' => 'admin', 'telecom_group_id' => $grupoB->id]);
    $userA = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupoA->id]);
    $userB = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupoB->id]);

    $response = $this->actingAs($superAdmin)
        ->getJson('/api/v1/users');

    $response->assertStatus(200)
        ->assertJsonCount(5, 'data'); // Todos os 5 usuários criados
});

test('permite que admin liste apenas usuários do seu próprio grupo de telecom', function () {
    $grupoA = TelecomGroup::factory()->create();
    $grupoB = TelecomGroup::factory()->create();

    $adminA = User::factory()->create(['role' => 'admin', 'telecom_group_id' => $grupoA->id]);
    $userA = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupoA->id]);
    
    // Usuários do outro grupo
    $adminB = User::factory()->create(['role' => 'admin', 'telecom_group_id' => $grupoB->id]);
    $userB = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupoB->id]);

    $response = $this->actingAs($adminA)
        ->getJson('/api/v1/users');

    $response->assertStatus(200)
        ->assertJsonCount(2, 'data'); // Apenas adminA e userA

    $emails = collect($response->json('data'))->pluck('email');
    expect($emails)->toContain($adminA->email)
        ->toContain($userA->email)
        ->not->toContain($adminB->email)
        ->not->toContain($userB->email);
});

test('impede que user de cargo comum liste usuários', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/users');

    $response->assertStatus(403);
});

test('permite que super_admin crie usuário definindo grupo e qualquer cargo', function () {
    $grupo = TelecomGroup::factory()->create();
    $superAdmin = User::factory()->create(['role' => 'super_admin']);

    $response = $this->actingAs($superAdmin)
        ->postJson('/api/v1/users', [
            'name' => 'Novo Admin',
            'email' => 'novoadmin@kayros.com',
            'password' => 'senha123',
            'role' => 'admin',
            'telecom_group_id' => $grupo->id
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.role', 'admin')
        ->assertJsonPath('data.telecom_group.id', $grupo->id);

    $this->assertDatabaseHas('users', [
        'email' => 'novoadmin@kayros.com',
        'telecom_group_id' => $grupo->id,
        'role' => 'admin'
    ]);
});

test('permite que admin crie usuário do seu próprio grupo sem poder definir telecom_group_id ou cargo superior', function () {
    $grupoA = TelecomGroup::factory()->create();
    $grupoB = TelecomGroup::factory()->create();
    $adminA = User::factory()->create(['role' => 'admin', 'telecom_group_id' => $grupoA->id]);

    // 1. Tenta definir telecom_group_id (deve ser proibido)
    $responseGroup = $this->actingAs($adminA)
        ->postJson('/api/v1/users', [
            'name' => 'Novo User',
            'email' => 'novouser@kayros.com',
            'password' => 'senha123',
            'role' => 'user',
            'telecom_group_id' => $grupoB->id
        ]);

    $responseGroup->assertStatus(422)
        ->assertJsonValidationErrors(['telecom_group_id']);

    // 2. Tenta criar um super_admin (deve ser rejeitado pela validação)
    $responseRole = $this->actingAs($adminA)
        ->postJson('/api/v1/users', [
            'name' => 'Novo User',
            'email' => 'novouser@kayros.com',
            'password' => 'senha123',
            'role' => 'super_admin'
        ]);

    $responseRole->assertStatus(422)
        ->assertJsonValidationErrors(['role']);

    // 3. Criação válida (telecom_group_id é omitido e herdado automaticamente pelo bootBelongsToTelecomGroup)
    $responseSuccess = $this->actingAs($adminA)
        ->postJson('/api/v1/users', [
            'name' => 'Novo User Sucesso',
            'email' => 'novousersucesso@kayros.com',
            'password' => 'senha123',
            'role' => 'user'
        ]);

    $responseSuccess->assertStatus(201)
        ->assertJsonPath('data.role', 'user')
        ->assertJsonPath('data.telecom_group.id', $grupoA->id);

    $this->assertDatabaseHas('users', [
        'email' => 'novousersucesso@kayros.com',
        'telecom_group_id' => $grupoA->id,
        'role' => 'user'
    ]);
});

test('permite que super_admin visualize qualquer usuário', function () {
    $grupo = TelecomGroup::factory()->create();
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $user = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupo->id]);

    $response = $this->actingAs($superAdmin)
        ->getJson("/api/v1/users/{$user->id}");

    $response->assertStatus(200)
        ->assertJsonPath('data.email', $user->email);
});

test('permite que admin visualize usuário do próprio grupo e impede de outro grupo', function () {
    $grupoA = TelecomGroup::factory()->create();
    $grupoB = TelecomGroup::factory()->create();

    $adminA = User::factory()->create(['role' => 'admin', 'telecom_group_id' => $grupoA->id]);
    $userA = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupoA->id]);
    $userB = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupoB->id]);

    // Visualiza usuário do mesmo grupo
    $responseSuccess = $this->actingAs($adminA)
        ->getJson("/api/v1/users/{$userA->id}");

    $responseSuccess->assertStatus(200)
        ->assertJsonPath('data.email', $userA->email);

    // Tenta visualizar usuário de outro grupo (deve retornar 404 devido ao Global Scope)
    $responseFail = $this->actingAs($adminA)
        ->getJson("/api/v1/users/{$userB->id}");

    $responseFail->assertStatus(404);
});

test('permite que super_admin atualize qualquer usuário', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($superAdmin)
        ->putJson("/api/v1/users/{$user->id}", [
            'name' => 'Nome Atualizado',
            'email' => 'emailatualizado@kayros.com',
            'password' => 'novasenha123',
            'role' => 'admin'
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('data.name', 'Nome Atualizado')
        ->assertJsonPath('data.email', 'emailatualizado@kayros.com')
        ->assertJsonPath('data.role', 'admin');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Nome Atualizado',
        'email' => 'emailatualizado@kayros.com',
        'role' => 'admin'
    ]);
});

test('permite que admin atualize usuário do mesmo grupo e impede de outro grupo ou super_admin', function () {
    $grupoA = TelecomGroup::factory()->create();
    $grupoB = TelecomGroup::factory()->create();

    $adminA = User::factory()->create(['role' => 'admin', 'telecom_group_id' => $grupoA->id]);
    $userA = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupoA->id]);
    $userB = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupoB->id]);
    $superAdmin = User::factory()->create(['role' => 'super_admin']);

    // 1. Atualiza do mesmo grupo
    $responseSuccess = $this->actingAs($adminA)
        ->putJson("/api/v1/users/{$userA->id}", [
            'name' => 'UserA Atualizado',
            'email' => $userA->email,
            'password' => 'senha12345'
        ]);
    $responseSuccess->assertStatus(200);

    // 2. Tenta atualizar outro grupo (deve retornar 404 devido ao Global Scope)
    $responseFailGroup = $this->actingAs($adminA)
        ->putJson("/api/v1/users/{$userB->id}", [
            'name' => 'UserB Atualizado',
            'email' => $userB->email,
            'password' => 'senha12345'
        ]);
    $responseFailGroup->assertStatus(404);

    // 3. Tenta atualizar super_admin (deve retornar 404 devido ao Global Scope do telecom_group_id de $superAdmin ser null e diferente do adminA, ou 403)
    $responseFailSuper = $this->actingAs($adminA)
        ->putJson("/api/v1/users/{$superAdmin->id}", [
            'name' => 'Super Atualizado',
            'email' => $superAdmin->email,
            'password' => 'senha12345'
        ]);
    $responseFailSuper->assertStatus(404);
});

test('impede que qualquer usuário altere o próprio cargo/role', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/users/{$admin->id}", [
            'name' => 'Admin Nome',
            'email' => $admin->email,
            'password' => 'senha12345',
            'role' => 'super_admin'
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['role']);
});

test('permite que super_admin remova outros usuários mas impede auto-exclusão', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $user = User::factory()->create(['role' => 'user']);

    // 1. Tenta auto-exclusão
    $responseSelf = $this->actingAs($superAdmin)
        ->deleteJson("/api/v1/users/{$superAdmin->id}");
    $responseSelf->assertStatus(403);

    // 2. Remove outro usuário
    $responseSuccess = $this->actingAs($superAdmin)
        ->deleteJson("/api/v1/users/{$user->id}");
    $responseSuccess->assertStatus(200);
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('permite que admin remova usuário do mesmo grupo e impede de outro grupo ou super_admin', function () {
    $grupoA = TelecomGroup::factory()->create();
    $grupoB = TelecomGroup::factory()->create();

    $adminA = User::factory()->create(['role' => 'admin', 'telecom_group_id' => $grupoA->id]);
    $userA = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupoA->id]);
    $userB = User::factory()->create(['role' => 'user', 'telecom_group_id' => $grupoB->id]);
    $superAdmin = User::factory()->create(['role' => 'super_admin']);

    // 1. Tenta remover usuário de outro grupo (deve dar 404 pelo Global Scope)
    $responseFailGroup = $this->actingAs($adminA)
        ->deleteJson("/api/v1/users/{$userB->id}");
    $responseFailGroup->assertStatus(404);

    // 2. Tenta remover super admin
    $responseFailSuper = $this->actingAs($adminA)
        ->deleteJson("/api/v1/users/{$superAdmin->id}");
    $responseFailSuper->assertStatus(404);

    // 3. Remove usuário do mesmo grupo
    $responseSuccess = $this->actingAs($adminA)
        ->deleteJson("/api/v1/users/{$userA->id}");
    $responseSuccess->assertStatus(200);
    $this->assertDatabaseMissing('users', ['id' => $userA->id]);
});
