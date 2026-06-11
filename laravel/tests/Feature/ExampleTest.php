<?php

test('the application returns 404 on root since it is a headless API', function () {
    $response = $this->get('/');

    $response->assertStatus(404);
});
