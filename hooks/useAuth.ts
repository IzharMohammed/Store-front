import { useState, useEffect, useCallback } from 'react';
import { sessionManager } from '@/lib/session-manager';

interface AuthUser {
    id: string;
    email: string;
    name: string;
}

interface UseAuthReturn {
    // User state
    isAuthenticated: boolean;
    user: AuthUser | null;
    sessionType: 'authenticated' | 'anonymous';
    anonymousSessionId: string | null;

    // Loading states
    isLoading: boolean;

    // Actions
    logout: () => Promise<void>;
    refreshSession: () => void;
}

export const useAuth = (): UseAuthReturn => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [anonymousSessionId, setAnonymousSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Initialize auth state
    const initializeAuth = useCallback(() => {
        // sessionManager.init();

        const authenticated = sessionManager.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
            setUser(sessionManager.getAuthUser());
            setAnonymousSessionId(null);
        } else {
            setUser(null);
            setAnonymousSessionId(sessionManager.getAnonymousSessionId());
        }

        setIsLoading(false);
    }, []);

    // Logout function
    const logout = useCallback(async (): Promise<void> => {
        setIsLoading(true);

        try {
            await sessionManager.logout();

            // Update local state
            setIsAuthenticated(false);
            setUser(null);
            setAnonymousSessionId(sessionManager.getAnonymousSessionId());

        } finally {
            setIsLoading(false);
        }
    }, []);

    // Refresh session
    const refreshSession = useCallback(() => {
        initializeAuth();
    }, [initializeAuth]);

    // Initialize on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    // Listen for auth changes across tabs
    useEffect(() => {
        const unsubscribe = sessionManager.onAuthChange((authenticated) => {
            if (authenticated !== isAuthenticated) {
                refreshSession();
            }
        });

        return unsubscribe;
    }, [isAuthenticated, refreshSession]);

    return {
        isAuthenticated,
        user,
        sessionType: isAuthenticated ? 'authenticated' : 'anonymous',
        anonymousSessionId,
        isLoading,
        logout,
        refreshSession
    };
};