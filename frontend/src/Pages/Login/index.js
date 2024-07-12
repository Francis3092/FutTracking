import { FaGoogle } from "react-icons/fa";
import { signInWithEmail, signInWithGoogle } from "../../Services/auth-service";
import useForm from "../../Hooks/useForm";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "../../Configs/supabaseClient"; // Importa el cliente de supabase

const initialState = {
    email: '',
    password: ''
};

const Login = () => {
    const { formValues, handleInputChange } = useForm(initialState);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Datos del formulario:", formValues);
        const { email, password } = formValues;
        const { user, error } = await signInWithEmail(email, password);
        if (error) {
            console.error("Error en handleSubmit:", error);
            setError(error);
        } else {
            console.log("Inicio de sesión exitoso:", user);
            setError(null);
            navigate('/home');
        }
    };

    const handleLoginGoogle = async () => {
        setError(null); // Clear any previous errors
        try {
            const { data, error } = await signInWithGoogle();
            if (error) throw error;
            // The redirection will be handled by Supabase, so we don't need to navigate manually
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            setError("An error occurred during Google sign-in. Please try again.");
        }
    };

    // Función de prueba directa de Supabase Auth
    const pruebaDirecta = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'juan.perez@example.com',
            password: 'contraseña123'
        });

        if (error) {
            console.error("Error en prueba directa de Supabase Auth:", error);
        } else {
            console.log("Prueba directa de Supabase Auth exitosa:", data);
        }
    };

    // Llamar a la función de prueba directa cuando se renderiza el componente
    useState(() => {
        pruebaDirecta();
    }, []);

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formValues.email} 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formValues.password} 
                    onChange={handleInputChange} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            <button onClick={handleLoginGoogle}>
                <FaGoogle /> Login with Google
            </button>
            <Link to="/register">No estás registrado? Regístrate</Link>
        </div>
    );
};

export default Login;
