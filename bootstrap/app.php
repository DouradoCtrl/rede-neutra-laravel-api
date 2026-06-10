<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use \App\Traits\ApiResponses;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return null;
            }
            return '/login';
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                $message = 'Recurso não encontrado.';
                
                if ($e->getPrevious() instanceof ModelNotFoundException) {
                    $modelClass = $e->getPrevious()->getModel();
                    $modelName = class_basename($modelClass);
                    
                    $translated = match($modelName) {
                        'User' => 'Usuário',    
                        'TelecomGroup' => 'Grupo de telecomunicação',
                        default => 'Registro'
                    };
                    
                    $message = "{$translated} não encontrado.";
                }

                $responder = new class {
                    use ApiResponses {
                        errorResponse as public;
                    }
                };

                return $responder->errorResponse($message, 404);
            }
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                $responder = new class {
                    use ApiResponses {
                        errorResponse as public;
                    }
                };

                return $responder->errorResponse(
                    $e->getMessage(),
                    422,
                    $e->errors()
                );
            }
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                $responder = new class {
                    use ApiResponses {
                        errorResponse as public;
                    }
                };

                return $responder->errorResponse(
                    'Usuário não autenticado.',
                    401
                );
            }
        });
    })->create();


