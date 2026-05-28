import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import pb from '../pocketbase';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization_id: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  hasRole: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // This calls PocketBase real login API
    const authData = await pb.collection('users').authWithPassword(email, password);
    
    const loggedInUser: User = {
      id: authData.record.id,
      email: authData.record.email,
      name: authData.record.name,
      role: authData.record.role,
      organization_id: authData.record.organization_id,
      is_active: authData.record.is_active,
    };
    
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
  }, []);

  const hasRole = useCallback((...roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}