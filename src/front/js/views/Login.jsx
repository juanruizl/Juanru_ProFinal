import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const Login = () => {
    const { actions, store } = useContext(Context); // Obtener contexto global
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!actions || !actions.login) {
            console.error("El contexto no está inicializado correctamente.");
            return;
        }

        setIsSubmitting(true); // Desactivar botón mientras se procesa
        const success = await actions.login(email, password); // Llamada a la acción de login
        setIsSubmitting(false); // Reactivar botón después de procesar

        if (success) {
            console.log("Inicio de sesión exitoso, redirigiendo...");
            navigate("/dashboard");
        } else {
            console.error("Error al iniciar sesión.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión</h2>

            {/* Mostrar mensaje de error */}
            {store.errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {store.errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Introduce tu correo"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Introduce tu contraseña"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting} // Desactivar botón mientras se procesa
                >
                    {isSubmitting ? "Cargando..." : "Iniciar Sesión"}
                </button>
            </form>
        </div>
    );
};

export default Login;


