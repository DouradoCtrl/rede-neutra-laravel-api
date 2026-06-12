export interface TelecomGroup {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role?: string;
  telecom_group?: TelecomGroup;
}

export interface MeResponse {
  status: string;
  data: UserProfile;
  message: string;
}

export interface ProfileUpdateData {
  name: string;
  email: string;
}

export interface PasswordUpdateData {
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export interface UserToken {
  id: number;
  name: string;
  last_used_at: string | null;
  created_at: string | null;
  is_current: boolean;
}

export interface UserTokensResponse {
  status: string;
  data: UserToken[];
  message: string;
}

export const userService = {
  /**
   * Fetches the user profile from the Laravel backend API using the provided token.
   */
  async getProfile(token: string): Promise<UserProfile> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    
    const response = await fetch(`${apiUrl}/api/v1/auth/profile/me`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      // Disable Next.js caching to ensure fresh profile state
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Falha ao obter perfil do usuário no servidor.");
    }

    const json = (await response.json()) as MeResponse;
    return json.data;
  },

  /**
   * Fetches the user profile from the local Next.js BFF proxy (client-side).
   */
  async getClientProfile(): Promise<UserProfile> {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Falha ao obter perfil do usuário no cliente.");
    }

    const json = (await response.json()) as MeResponse;
    return json.data;
  },

  /**
   * Updates the user profile on the Laravel backend using the provided token.
   */
  async updateProfile(token: string, data: ProfileUpdateData): Promise<unknown> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    
    const response = await fetch(`${apiUrl}/api/v1/auth/profile/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        ...responseData,
        status: response.status,
      };
    }

    return responseData;
  },

  /**
   * Updates the user password on the Laravel backend using the provided token.
   */
  async updatePassword(token: string, data: PasswordUpdateData): Promise<unknown> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    
    const response = await fetch(`${apiUrl}/api/v1/auth/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        ...responseData,
        status: response.status,
      };
    }

    return responseData;
  },

  /**
   * Calls the local BFF /api/auth/profile/me to update user profile (client-side).
   */
  async updateClientProfile(data: ProfileUpdateData): Promise<unknown> {
    const response = await fetch("/api/auth/profile/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || "Falha ao atualizar perfil do usuário.",
        errors: responseData.errors,
      };
    }

    return responseData;
  },

  /**
   * Calls the local BFF /api/auth/profile/password to update user password (client-side).
   */
  async updateClientPassword(data: PasswordUpdateData): Promise<unknown> {
    const response = await fetch("/api/auth/profile/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || "Falha ao atualizar senha do usuário.",
        errors: responseData.errors,
      };
    }

    return responseData;
  },

  /**
   * Fetches the user session tokens from the Laravel backend API using the provided token (server-side).
   */
  async getProfileTokens(token: string): Promise<UserToken[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    
    const response = await fetch(`${apiUrl}/api/v1/auth/profile/tokens`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Falha ao obter tokens de sessão no servidor.");
    }

    const json = (await response.json()) as UserTokensResponse;
    return json.data;
  },

  /**
   * Revokes a user session token on the Laravel backend using the provided token (server-side).
   */
  async revokeProfileToken(token: string, id: number): Promise<unknown> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    
    const response = await fetch(`${apiUrl}/api/v1/auth/profile/tokens/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        ...responseData,
        status: response.status,
      };
    }

    return responseData;
  },

  /**
   * Calls the local BFF /api/auth/profile/tokens to get active tokens (client-side).
   */
  async getClientTokens(): Promise<UserToken[]> {
    const response = await fetch("/api/auth/profile/tokens", {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Falha ao obter tokens de sessão no cliente.");
    }

    const json = (await response.json()) as UserTokensResponse;
    return json.data;
  },

  /**
   * Calls the local BFF /api/auth/profile/tokens/[id] to revoke a token (client-side).
   */
  async revokeClientToken(id: number): Promise<unknown> {
    const response = await fetch(`/api/auth/profile/tokens/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
      },
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || "Falha ao revogar sessão.",
      };
    }

    return responseData;
  },
};
