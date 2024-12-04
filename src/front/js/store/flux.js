const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            currentUser: null,
            transactions: [],
            payments: [],
            projects: [],
            budgets: [],
            errorMessage: null,
            loading: false,
        },
        actions: {
            // Iniciar sesión
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
                    setStore({ token: data.token });
                    sessionStorage.setItem("token", data.token);
                    return true;
                } catch (error) {
                    setStore({ errorMessage: error.message });
                    return false;
                } finally {
                    setStore({ loading: false });
                }
            },

            // Cerrar sesión
            logout: () => {
                setStore({ token: null, currentUser: null });
                sessionStorage.removeItem("token");
            },

            // Obtener datos del usuario actual
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

                    if (!resp.ok) throw new Error("Error al obtener el usuario");

                    const data = await resp.json();
                    setStore({ currentUser: data });
                } catch (error) {
                    console.error("Error al obtener el usuario:", error);
                } finally {
                    setStore({ loading: false });
                }
            },

            // Sincronizar el token al cargar la app
            syncTokenFromSessionStorage: () => {
                const token = sessionStorage.getItem("token");
                if (token) setStore({ token });
            },

            // Obtener todas las transacciones
            getTransactions: async () => {
                const store = getStore();
                try {
                    const resp = await getActions().fetchWithToken(
                        `${process.env.BACKEND_URL}/api/transactions`
                    );

                    setStore({ transactions: resp });
                } catch (error) {
                    console.error("Error al obtener las transacciones:", error);
                }
            },

            // Crear transacción
            createTransaction: async (transactionData) => {
                const store = getStore();
                try {
                    const resp = await getActions().fetchWithToken(
                        `${process.env.BACKEND_URL}/api/transactions`,
                        {
                            method: "POST",
                            body: JSON.stringify(transactionData),
                        }
                    );
                    setStore({ transactions: [...store.transactions, resp] });
                    return true;
                } catch (error) {
                    console.error("Error al crear la transacción:", error);
                    return false;
                }
            },

            // Eliminar transacción
            deleteTransaction: async (transactionId) => {
                const store = getStore();
                try {
                    await getActions().fetchWithToken(
                        `${process.env.BACKEND_URL}/api/transactions/${transactionId}`,
                        { method: "DELETE" }
                    );
                    const updatedTransactions = store.transactions.filter(
                        (transaction) => transaction.id !== transactionId
                    );
                    setStore({ transactions: updatedTransactions });
                } catch (error) {
                    console.error("Error al eliminar la transacción:", error);
                }
            },

            // Obtener todos los pagos
            getPayments: async () => {
                try {
                    const resp = await getActions().fetchWithToken(
                        `${process.env.BACKEND_URL}/api/payments`
                    );
                    setStore({ payments: resp });
                } catch (error) {
                    console.error("Error al obtener los pagos:", error);
                }
            },

            // Obtener todos los proyectos
            getProjects: async () => {
                try {
                    const resp = await getActions().fetchWithToken(
                        `${process.env.BACKEND_URL}/api/projects`
                    );
                    setStore({ projects: resp });
                } catch (error) {
                    console.error("Error al obtener los proyectos:", error);
                }
            },

            // Obtener todos los presupuestos
            getBudgets: async () => {
                try {
                    const resp = await getActions().fetchWithToken(
                        `${process.env.BACKEND_URL}/api/budgets`
                    );
                    setStore({ budgets: resp });
                } catch (error) {
                    console.error("Error al obtener los presupuestos:", error);
                }
            },

            // Solicitud protegida genérica
            fetchWithToken: async (url, options = {}) => {
                const store = getStore();
                try {
                    const resp = await fetch(url, {
                        ...options,
                        headers: {
                            ...options.headers,
                            Authorization: `Bearer ${store.token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error(errorData.msg || `Error ${resp.status}`);
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
