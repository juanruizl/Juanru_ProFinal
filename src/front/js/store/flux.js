const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            currentUser: null,
            transactions: [], // Almacén para las transacciones
            errorMessage: null,
            loading: false, // Indicador de carga
        },
        actions: {
            // Login
            login: async (email, password) => {
                setStore({ loading: true, errorMessage: null });
                try {
                    console.log("Iniciando sesión con email:", email);
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!resp.ok) {
                        const errorData = await resp.json();
                        console.error("Error en el login:", errorData);
                        throw new Error(errorData.msg || "Error en el inicio de sesión");
                    }

                    const data = await resp.json();
                    console.log("Login exitoso, token recibido:", data.token);
                    setStore({ token: data.token });

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
                console.log("Cerrando sesión...");
                setStore({ token: null, currentUser: null });
                sessionStorage.removeItem("token");
            },

            signup: async (name, email, password) => {
                setStore({ loading: true, errorMessage: null });
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/users`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, email, password }),
                    });

                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error(errorData.msg || "Error en el registro");
                    }

                    console.log("Usuario registrado con éxito.");
                    return true;
                } catch (error) {
                    console.error("Error al registrarse:", error);
                    setStore({ errorMessage: error.message });
                    return false;
                } finally {
                    setStore({ loading: false });
                }
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
                    console.log("Usuario obtenido con éxito:", data);
                    setStore({ currentUser: data });
                } catch (error) {
                    console.error("Error al obtener el usuario:", error);
                } finally {
                    setStore({ loading: false });
                }
            },

            // Obtener transacciones
            getTransactions: async () => {
                const store = getStore();
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/transactions`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${store.token}`,
                        },
                    });
            
                    if (!resp.ok) {
                        throw new Error("Error al obtener las transacciones");
                    }
            
                    const data = await resp.json();
                    setStore({ transactions: data }); // Asegúrate de que setStore esté disponible
                    console.log("Transacciones obtenidas:", data);
                } catch (error) {
                    console.error("Error al obtener las transacciones:", error);
                }
            },
            
            deleteTransaction: async (transactionId) => {
                const store = getStore();
                try {
                    const resp = await actions.fetchWithToken(
                        `${process.env.BACKEND_URL}/api/transactions/${transactionId}`,
                        { method: "DELETE" }
                    );
            
                    if (resp.message) {
                        console.log("Transacción eliminada:", resp.message);
                        // Actualizar las transacciones en el store
                        const updatedTransactions = store.transactions.filter(
                            (transaction) => transaction.id !== transactionId
                        );
                        setStore({ transactions: updatedTransactions });
                    }
                } catch (error) {
                    console.error("Error al eliminar la transacción:", error);
                }
            },
            
            createTransaction: async (transactionData) => {
                const store = getStore();
                try {
                    const resp = await actions.fetchWithToken(
                        `${process.env.BACKEND_URL}/api/transactions`,
                        {
                            method: "POST",
                            body: JSON.stringify(transactionData),
                        }
                    );
            
                    if (resp) {
                        console.log("Transacción creada:", resp);
                        setStore({ transactions: [...store.transactions, resp] });
                        return true;
                    }
                } catch (error) {
                    console.error("Error al crear transacción:", error);
                    return false;
                }
            },
            

            // Verificar si hay token en sessionStorage al cargar la app
            syncTokenFromSessionStorage: () => {
                const token = sessionStorage.getItem("token");
                if (token) {
                    console.log("Token sincronizado desde sessionStorage");
                    setStore({ token });
                } else {
                    console.warn("No se encontró un token en sessionStorage");
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
                            "Content-Type": "application/json", // Asegurar Content-Type por defecto
                        },
                    });

                    if (resp.status === 401) {
                        console.warn("Token inválido o expirado, cerrando sesión...");
                        getActions().logout();
                        throw new Error("Sesión expirada, inicia sesión nuevamente.");
                    }

                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error(errorData.msg || `Error ${resp.status}`);
                    }

                    return await resp.json();
                } catch (error) {
                    console.error("Error en la solicitud protegida:", error);
                    setStore({ errorMessage: error.message });
                    throw error;
                }
            },
        },
    };
};

export default getState;
