import { FaGoogle } from "react-icons/fa";
import { signInWithEmail, signInWithGoogle } from "../../Services/auth-service";
import useForm from "../../Hooks/useForm";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const initialState = {
    email: '',
    password: ''
}

const Login = () => {
    const { formValues, handleInputChange } = useForm(initialState);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = formValues;

        const result = await signInWithEmail(email, password);

        if (result.error) {
            setError("Email or password is incorrect.");
        } else {
            setError(null);
            navigate('/home');
        }
    }

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
      }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formValues.email}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formValues.password}
                    onChange={handleInputChange}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleLoginGoogle}>
                <FaGoogle />
                Login with Google
            </button>
            <p>No estás registrado? <Link to="/register">Regístrate</Link></p>
        </div>
    )
}

export default Login;
