// auth-service.js
import supabase from "../supabaseClient.js";

class AuthService {
  async loginAsync(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return { error: error.message };
    }

    return { user: data.user, error: null };
  }
}

export default AuthService;
