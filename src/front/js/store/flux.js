const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            currentUser: null,
            errorMessage: null,
            loading: false, // Indicador de carga
        },
        actions: {
            // Login
            login: async (email, password) => {
                setStore({ loading: true, errorMessage: null });
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error(errorData.msg || "Error en el inicio de sesión");
                    }

                    const data = await resp.json();
                    setStore({ token: data.token, errorMessage: null });

                    // Guardar el token en sessionStorage
                    sessionStorage.setItem("token", data.token);
                    return true;
                } catch (error) {
                    console.error("Error al iniciar sesión:", error);
                    setStore({ errorMessage: error.message });
                    return false;
                } finally {
                    setStore({ loading: false });
                }
            },

            // Logout
            logout: () => {
                setStore({ token: null, currentUser: null });
                sessionStorage.removeItem("token");
            },

            // Obtener usuario actual
            getCurrentUser: async () => {
                const store = getStore();
                setStore({ loading: true });
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/protected`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${store.token}`,
                        },
                    });

                    if (!resp.ok) {
                        throw new Error("Error al obtener el usuario");
                    }

                    const data = await resp.json();
                    setStore({ currentUser: data });
                } catch (error) {
                    console.error("Error al obtener el usuario:", error);
                } finally {
                    setStore({ loading: false });
                }
            },

            // Verificar si hay token en sessionStorage al cargar la app
            syncTokenFromSessionStorage: () => {
                const token = sessionStorage.getItem("token");
                if (token) {
                    setStore({ token });
                }
            },

            // Acción genérica para solicitudes protegidas
            fetchWithToken: async (url, options = {}) => {
                const store = getStore();
                try {
                    const resp = await fetch(url, {
                        ...options,
                        headers: {
                            ...options.headers,
                            Authorization: `Bearer ${store.token}`,
                        },
                    });

                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error(errorData.msg || "Error en la solicitud");
                    }

                    return await resp.json();
                } catch (error) {
                    console.error("Error en la solicitud protegida:", error);
                    throw error;
                }
            },
        },
    };
};

export default getState;
