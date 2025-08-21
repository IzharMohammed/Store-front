interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

class SessionManager {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';
  private readonly ANONYMOUS_SESSION_KEY = 'anonymous_session_id';

  /**
   * Initialize session management
   * This should be called when your app starts
   */
  init(): void {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    // If no auth token exists, generate anonymous session ID
    if (!this.getAuthToken()) {
      this.ensureAnonymousSession();
    }
  }

  /**
   * Check if user is authenticated (has Better Auth token)
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Get the current session type
   */
  getSessionType(): 'authenticated' | 'anonymous' {
    return this.isAuthenticated() ? 'authenticated' : 'anonymous';
  }

  /**
   * Get Better Auth token
   */
  getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  /**
   * Get authenticated user data
   */
  getAuthUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Set authenticated user data after successful login
   */
  setAuthenticatedUser(loginResponse: LoginResponse): void {
    if (typeof window === 'undefined') return;

    // Store Better Auth token and user data
    localStorage.setItem(this.AUTH_TOKEN_KEY, loginResponse.token);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(loginResponse.user));

    // Clear anonymous session since user is now authenticated
    this.clearAnonymousSession();
  }

  /**
   * Get anonymous session ID (for non-authenticated users)
   */
  getAnonymousSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ANONYMOUS_SESSION_KEY);
  }

  /**
   * Ensure anonymous session exists
   */
  private ensureAnonymousSession(): void {
    if (typeof window === 'undefined') return;

    if (!this.getAnonymousSessionId()) {
      const sessionId = this.generateUUID();
      localStorage.setItem(this.ANONYMOUS_SESSION_KEY, sessionId);
    }
  }

  /**
   * Clear anonymous session
   */
  private clearAnonymousSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ANONYMOUS_SESSION_KEY);
  }

  /**
   * Logout user and clear all session data
   */
  async logout(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Call logout endpoint if authenticated
      if (this.isAuthenticated()) {
        await fetch('/api/auth/signout', {
          method: 'POST',
          credentials: 'include'
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    // Clear all session data
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);

    // Regenerate anonymous session
    this.ensureAnonymousSession();
  }

  /**
   * Get headers for API requests
   */
  getApiHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add auth token if available
    // const token = this.getAuthToken();
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Make authenticated API request
   */
  async apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getApiHeaders(),
        ...options.headers
      },
      credentials: 'include' // Important for session cookies
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate UUID for anonymous sessions
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Get current user info regardless of auth status
   */
  getCurrentUser(): { type: 'authenticated' | 'anonymous'; data: any } {
    if (this.isAuthenticated()) {
      return {
        type: 'authenticated',
        data: this.getAuthUser()
      };
    } else {
      return {
        type: 'anonymous',
        data: {
          sessionId: this.getAnonymousSessionId()
        }
      };
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthChange(callback: (isAuthenticated: boolean) => void): () => void {
    if (typeof window === 'undefined') return () => { };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === this.AUTH_TOKEN_KEY) {
        callback(!!e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();