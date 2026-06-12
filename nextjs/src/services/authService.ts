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

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export const authService = {
  /**
   * Calls the external Laravel API to authenticate the user and obtain a Sanctum Bearer Token.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    
    const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
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
  },

  /**
   * Performs logout by calling the local Next.js API proxy to clear the HTTP-only cookie.
   */
  async logout(): Promise<LogoutResponse> {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        message: data.message || 'Falha ao realizar logout.'
      };
    }

    return data as LogoutResponse;
  },

  /**
   * Performs login by calling the local Next.js API proxy (client-side).
   */
  async loginClient(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Falha ao realizar login.',
        errors: data.errors,
      };
    }

    return data;
  }
};

