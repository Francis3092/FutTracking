import { createContext, useEffect, useState } from 'react'
import { supabase } from '../Configs/supabaseClient'

export const AuthContext = createContext({
  user: null
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      const user = supabase.auth.user;
      setUser(user);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
