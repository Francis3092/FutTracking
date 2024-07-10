import { createContext, useEffect, useState } from 'react';
import { supabase } from '../Configs/supabaseClient';

export const AuthContext = createContext({
  user: null
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        setAuthError(null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, authError }}>
      {children}
    </AuthContext.Provider>
  );
};
