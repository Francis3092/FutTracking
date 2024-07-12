import { createContext, useEffect, useState } from 'react';
import { supabase } from '../Configs/supabaseClient';

export const AuthContext = createContext({
    user: null,
    authError: null,
    setAuthError: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth event:", event); // Log para verificar el evento
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
              if (session?.user) {
                  if (session.user.app_metadata.provider === 'google') {
                      setUser(session.user);
                  } else {
                      const { data: customUser, error } = await supabase
                          .from('usuarios')
                          .select('*')
                          .eq('email', session.user.email)
                          .single();
                      if (customUser) {
                          setUser({ ...customUser, auth_id: session.user.id });
                      } else {
                          await supabase.auth.signOut();
                          setUser(null);
                          setAuthError("Usuario no encontrado");
                      }
                  }
                  setAuthError(null);
              }
          } else if (event === 'SIGNED_OUT') {
              setUser(null);
          }
      });
  
      return () => {
          authListener?.unsubscribe();
      };
  }, []);
  

    return (
        <AuthContext.Provider value={{ user, authError, setAuthError }}>
            {children}
        </AuthContext.Provider>
    );
};
