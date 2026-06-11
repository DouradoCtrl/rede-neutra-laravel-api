<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('permite realizar login com credenciais válidas e retorna token bearer', function () {
    $user = User::factory()->create([
        'email' => 'teste@kayros.com',
        'password' => bcrypt('senha123'),
        'role' => 'user'
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'teste@kayros.com',
        'password' => 'senha123',
        'device_name' => 'test_device'
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'Login realizado com sucesso.',
        ]);

    $data = $response->json('data');
    expect($data)->toHaveKey('token')
        ->and($data['user']['email'])->toBe('teste@kayros.com');
});

test('retorna erro se as credenciais de login forem inválidas', function () {
    $user = User::factory()->create([
        'email' => 'teste@kayros.com',
        'password' => bcrypt('senha123')
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'teste@kayros.com',
        'password' => 'senha_errada'
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('exige os campos obrigatórios no login', function () {
    $response = $this->postJson('/api/v1/auth/login', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email', 'password']);
});

test('permite obter os dados do usuário autenticado no endpoint me', function () {
    $user = User::factory()->create([
        'email' => 'teste@kayros.com',
        'role' => 'admin'
    ]);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/auth/profile/me');

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'Dados do usuário autenticado obtidos com sucesso.',
            'data' => [
                'email' => 'teste@kayros.com',
                'role' => 'admin'
            ]
        ]);
});

test('impede de acessar o endpoint me sem estar autenticado', function () {
    $response = $this->getJson('/api/v1/auth/profile/me');

    $response->assertStatus(401);
});

test('permite realizar logout e revoga o token de acesso', function () {
    $user = User::factory()->create();

    // Simula login para obter token
    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/v1/auth/logout');

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'Deslogado com sucesso'
        ]);

    // O token deve ser removido do banco de dados
    $this->assertDatabaseCount('personal_access_tokens', 0);

    // Limpa a autenticação resolvida no container para o próximo request
    $this->app['auth']->forgetUser();

    // O token não deve mais ser válido
    $responseMe = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->getJson('/api/v1/auth/profile/me');

    $responseMe->assertStatus(401);
});
