<?php

use App\Models\User;
use App\Models\TelecomGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('permite que super_admin liste os grupos de telecom', function () {
    TelecomGroup::factory()->count(3)->create();
    $superAdmin = User::factory()->create(['role' => 'super_admin']);

    $response = $this->actingAs($superAdmin)
        ->getJson('/api/v1/telecom-groups');

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');
});

test('impede que admin ou user listem os grupos de telecom', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'user']);

    $responseAdmin = $this->actingAs($admin)
        ->getJson('/api/v1/telecom-groups');
    $responseAdmin->assertStatus(403);

    $responseUser = $this->actingAs($user)
        ->getJson('/api/v1/telecom-groups');
    $responseUser->assertStatus(403);
});

test('permite que super_admin crie um grupo telecom gerando slug automaticamente', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);

    $response = $this->actingAs($superAdmin)
        ->postJson('/api/v1/telecom-groups', [
            'name' => 'Kayros Telecom',
            'active' => true
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.name', 'Kayros Telecom')
        ->assertJsonPath('data.slug', 'kayros-telecom')
        ->assertJsonPath('data.active', true);

    $this->assertDatabaseHas('telecom_groups', [
        'name' => 'Kayros Telecom',
        'slug' => 'kayros-telecom',
        'active' => 1
    ]);
});

test('permite que super_admin crie um grupo telecom com slug personalizado', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);

    $response = $this->actingAs($superAdmin)
        ->postJson('/api/v1/telecom-groups', [
            'name' => 'Kayros Telecom',
            'slug' => 'kayros-custom-slug',
            'active' => true
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.slug', 'kayros-custom-slug');

    $this->assertDatabaseHas('telecom_groups', [
        'name' => 'Kayros Telecom',
        'slug' => 'kayros-custom-slug'
    ]);
});

test('impede que admin ou user criem grupos telecom', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/telecom-groups', [
            'name' => 'Kayros Telecom',
            'active' => true
        ]);

    $response->assertStatus(403);
});

test('permite que super_admin visualize um grupo telecom', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $group = TelecomGroup::factory()->create();

    $response = $this->actingAs($superAdmin)
        ->getJson("/api/v1/telecom-groups/{$group->id}");

    $response->assertStatus(200)
        ->assertJsonPath('data.name', $group->name)
        ->assertJsonPath('data.slug', $group->slug);
});

test('impede que admin ou user visualizem um grupo telecom', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $group = TelecomGroup::factory()->create();

    $response = $this->actingAs($admin)
        ->getJson("/api/v1/telecom-groups/{$group->id}");

    $response->assertStatus(403);
});

test('permite que super_admin atualize um grupo telecom', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $group = TelecomGroup::factory()->create();

    $response = $this->actingAs($superAdmin)
        ->putJson("/api/v1/telecom-groups/{$group->id}", [
            'name' => 'Nome Atualizado',
            'slug' => 'slug-atualizado',
            'active' => false
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('data.name', 'Nome Atualizado')
        ->assertJsonPath('data.slug', 'slug-atualizado')
        ->assertJsonPath('data.active', false);

    $this->assertDatabaseHas('telecom_groups', [
        'id' => $group->id,
        'name' => 'Nome Atualizado',
        'slug' => 'slug-atualizado',
        'active' => 0
    ]);
});

test('impede que admin ou user atualizem um grupo telecom', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $group = TelecomGroup::factory()->create();

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/telecom-groups/{$group->id}", [
            'name' => 'Nome Atualizado',
            'slug' => 'slug-atualizado',
            'active' => false
        ]);

    $response->assertStatus(403);
});

test('permite que super_admin remova um grupo telecom', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $group = TelecomGroup::factory()->create();

    $response = $this->actingAs($superAdmin)
        ->deleteJson("/api/v1/telecom-groups/{$group->id}");

    $response->assertStatus(200);
    $this->assertDatabaseMissing('telecom_groups', ['id' => $group->id]);
});

test('impede que admin ou user removam um grupo telecom', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $group = TelecomGroup::factory()->create();

    $response = $this->actingAs($admin)
        ->deleteJson("/api/v1/telecom-groups/{$group->id}");

    $response->assertStatus(403);
    $this->assertDatabaseHas('telecom_groups', ['id' => $group->id]);
});
