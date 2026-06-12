<?php

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('permite listar as sessoes/tokens ativos do usuario autenticado', function () {
    $user = User::factory()->create();

    // Cria tokens simulando diferentes sessoes
    $token1 = $user->createToken('Dispositivo A');
    $token2 = $user->createToken('Dispositivo B');

    // Acessa autenticado com o token1
    $response = $this->withHeader('Authorization', 'Bearer ' . $token1->plainTextToken)
        ->getJson('/api/v1/auth/profile/tokens');

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'Tokens recuperados com sucesso.'
        ]);

    $data = $response->json('data');
    expect($data)->toHaveCount(2);

    // Verifica se os campos corretos estao presentes
    expect($data[0])->toHaveKeys(['id', 'name', 'created_at', 'last_used_at', 'is_current']);
    
    // Verifica se identificou corretamente o token atual (token1)
    $currentTokens = array_filter($data, fn($token) => $token['name'] === 'Dispositivo A');
    $otherTokens = array_filter($data, fn($token) => $token['name'] === 'Dispositivo B');
    
    expect(reset($currentTokens)['is_current'])->toBeTrue();
    expect(reset($otherTokens)['is_current'])->toBeFalse();
});

test('nao retorna tokens de outros usuarios na listagem', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $token1 = $user1->createToken('Dispositivo Usuario 1');
    $token2 = $user2->createToken('Dispositivo Usuario 2');

    $response = $this->withHeader('Authorization', 'Bearer ' . $token1->plainTextToken)
        ->getJson('/api/v1/auth/profile/tokens');

    $response->assertStatus(200);
    $data = $response->json('data');
    expect($data)->toHaveCount(1);
    expect($data[0]['name'])->toBe('Dispositivo Usuario 1');
});

test('impede de listar os tokens se nao estiver autenticado', function () {
    $response = $this->getJson('/api/v1/auth/profile/tokens');
    $response->assertStatus(401);
});

test('permite revogar uma sessao/token remoto especifico do usuario', function () {
    $user = User::factory()->create();

    $token1 = $user->createToken('Dispositivo Atual');
    $token2 = $user->createToken('Dispositivo Remoto');

    $response = $this->withHeader('Authorization', 'Bearer ' . $token1->plainTextToken)
        ->deleteJson('/api/v1/auth/profile/tokens/' . $token2->accessToken->id);

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'Sessão revogada com sucesso.'
        ]);

    // O token remoto deve ter sido apagado
    $this->assertDatabaseMissing('personal_access_tokens', [
        'id' => $token2->accessToken->id
    ]);

    // O token atual deve continuar ativo
    $this->assertDatabaseHas('personal_access_tokens', [
        'id' => $token1->accessToken->id
    ]);
});

test('impede que o usuario revogue a sua propria sessao atual', function () {
    $user = User::factory()->create();

    $token = $user->createToken('Dispositivo Atual');

    $response = $this->withHeader('Authorization', 'Bearer ' . $token->plainTextToken)
        ->deleteJson('/api/v1/auth/profile/tokens/' . $token->accessToken->id);

    $response->assertStatus(400)
        ->assertJson([
            'status' => 'error',
            'message' => 'Você não pode revogar a sua sessão atual.'
        ]);

    // O token deve continuar ativo
    $this->assertDatabaseHas('personal_access_tokens', [
        'id' => $token->accessToken->id
    ]);
});

test('retorna erro 404 ao tentar revogar um token inexistente ou de outro usuario', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $token1 = $user1->createToken('Dispositivo Usuario 1');
    $token2 = $user2->createToken('Dispositivo Usuario 2');

    // Tenta revogar o token do user2 usando autenticacao do user1
    $response = $this->withHeader('Authorization', 'Bearer ' . $token1->plainTextToken)
        ->deleteJson('/api/v1/auth/profile/tokens/' . $token2->accessToken->id);

    $response->assertStatus(404)
        ->assertJson([
            'status' => 'error',
            'message' => 'Sessão não encontrada.'
        ]);

    // O token do user2 deve continuar ativo
    $this->assertDatabaseHas('personal_access_tokens', [
        'id' => $token2->accessToken->id
    ]);
});
