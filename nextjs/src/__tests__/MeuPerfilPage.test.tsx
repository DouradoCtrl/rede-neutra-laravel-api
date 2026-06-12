import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MeuPerfilPage from "../app/(authenticated)/meu-perfil/page";
import { userService } from "../services/userService";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      refresh: vi.fn(),
    };
  },
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock userService
vi.mock("../services/userService", () => ({
  userService: {
    getClientProfile: vi.fn(),
    getClientTokens: vi.fn(),
    revokeClientToken: vi.fn(),
  },
}));

describe("MeuPerfilPage - Sessions Tab", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mocks
    vi.mocked(userService.getClientProfile).mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
    });
  });

  it("should render profile pages and call getClientTokens when sessions tab is opened", async () => {
    const mockTokens = [
      {
        id: 1,
        name: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
        created_at: "2026-06-12T10:00:00Z",
        last_used_at: "2026-06-12T12:00:00Z",
        is_current: true,
      },
      {
        id: 2,
        name: "PostmanRuntime/7.40.0",
        created_at: "2026-06-12T11:00:00Z",
        last_used_at: "2026-06-12T11:30:00Z",
        is_current: false,
      },
    ];

    vi.mocked(userService.getClientTokens).mockResolvedValue(mockTokens);

    render(<MeuPerfilPage />);

    // Wait for initial profile load
    await waitFor(() => {
      expect(screen.getByText("Dados Pessoais")).toBeDefined();
    });

    // Click on sessions tab
    const sessionsTab = screen.getByText("Sessões");
    fireEvent.click(sessionsTab);

    // Verify token listing
    await waitFor(() => {
      expect(userService.getClientTokens).toHaveBeenCalledTimes(2); // Mount + tab click
      expect(screen.getByText("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0")).toBeDefined();
      expect(screen.getByText("PostmanRuntime/7.40.0")).toBeDefined();
    });
  });
});
