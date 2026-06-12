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
};
