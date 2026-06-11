export interface LoginCredentials {
  email: string;
  password?: string;
  device_name?: string;
}

export interface AuthResponse {
  status?: string;
  data?: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface AuthErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export const authService = {
  /**
   * Calls the external Laravel API to authenticate the user and obtain a Sanctum Bearer Token.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    const response = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      // Typically a 422 Unprocessable Entity
      const errorData: AuthErrorResponse = await response.json().catch(() => ({ 
        message: 'Falha na comunicação com o servidor.' 
      }));
      // Throw the structured error so the calling proxy can forward it down to the UI
      throw errorData;
    }

    return response.json();
  }
};
