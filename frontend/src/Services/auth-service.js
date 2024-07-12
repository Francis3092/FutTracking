import { supabase } from "../Configs/supabaseClient";

export const signInWithEmail = async (email, password) => {
    console.log("Iniciando sesión con:", email, password);
    try {
        // Busca en tu tabla de usuarios personalizada
        const { data: customUser, error: customError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (customError) {
            console.error("Error al buscar usuario:", customError);
            return { user: null, error: "Error al iniciar sesión" };
        }

        console.log("Usuario encontrado:", customUser);

        if (customUser && customUser.contraseña === password) {
            console.log("Contraseña correcta, intentando iniciar sesión en Supabase Auth...");
            // Intenta iniciar sesión en Supabase Auth
            let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: customUser.email,
                password: password
            });

            if (signInError) {
                console.error("Error al iniciar sesión en Supabase Auth:", signInError);
                if (signInError.status === 400 && signInError.message === 'Invalid login credentials') {
                    console.log("Usuario no existe en Supabase Auth, registrándolo...");
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email: customUser.email,
                        password: password
                    });

                    if (signUpError) {
                        console.error("Error al registrar usuario en Supabase Auth:", signUpError);
                        return { user: null, error: "Error al registrar usuario" };
                    }

                    signInData = signUpData;
                } else {
                    console.error("Error al iniciar sesión en Supabase Auth:", signInError);
                    return { user: null, error: "Error al iniciar sesión" };
                }
            }

            console.log("Inicio de sesión en Supabase Auth exitoso:", signInData);

            const user = signInData.user || signInData;

            return { user: { ...customUser, auth_id: user.id }, error: null };
        }

        console.log("Contraseña incorrecta");
        return { user: null, error: "Email o contraseña incorrectos" };
    } catch (err) {
        console.error("Error en signInWithEmail:", err);
        return { user: null, error: "Error desconocido" };
    }
};



export const signUpWithEmail = async (data) => {
    const result = await supabase.auth.signUp(data);
    return result;
};

export const updateProfile = async (data) => {
    try {
        await supabase.from('profiles').upsert(data, { returning: 'minimal' });
    } catch (error) {
        console.error(error);
    }
};

export const signInWithMagicLink = async (email) => {
    const result = await supabase.auth.signIn({
        email
    });
    return result;
};

export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/home'
            }
        });
        if (error) throw error;
        return { data };
    } catch (error) {
        console.error('Error during Google sign-in', error);
        return { error };
    }
};

export const logout = async () => {
    const result = await supabase.auth.signOut();
    return result;
};

export const getUserProfile = async () => {
    try {
        const user = supabase.auth.user();

        if (user) {
            const { id, app_metadata, user_metadata } = user;
            if (app_metadata.provider === 'google') {
                const { full_name } = user_metadata;
                return { username: full_name };
            }

            const { data, error, status } = await supabase
                .from('profiles')
                .select('id, full_name, updated_at')
                .eq('id', id)
                .single();

            if (error && status === 406) {
                throw new Error('An error has occurred');
            }

            return {
                username: data.full_name
            };
        }
    } catch (error) {
        console.log(error);
    }
};
