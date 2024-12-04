import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const Budgets = () => {
    const { store, actions } = useContext(Context);
    const [newBudget, setNewBudget] = useState({ project_id: "", amount: "", status: "" });

    useEffect(() => {
        actions.getBudgets();
    }, []);

    const handleChange = (e) => {
        setNewBudget({ ...newBudget, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const success = await actions.createBudget(newBudget);
        if (success) {
            setNewBudget({ project_id: "", amount: "", status: "" });
            actions.getBudgets(); // Actualizar la lista
        }
    };

    const handleDelete = (id) => {
        actions.deleteBudget(id);
    };

    return (
        <div className="container mt-4">
            <h1>Gestión de Presupuestos</h1>

            <form onSubmit={handleCreate} className="mb-4">
                <h4>Crear nuevo presupuesto</h4>
                <div className="mb-3">
                    <label className="form-label">ID del Proyecto</label>
                    <input
                        type="text"
                        className="form-control"
                        name="project_id"
                        value={newBudget.project_id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Monto</label>
                    <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={newBudget.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <input
                        type="text"
                        className="form-control"
                        name="status"
                        value={newBudget.status}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Crear</button>
            </form>

            <h4>Lista de Presupuestos</h4>
            {store.budgets?.length > 0 ? (
                <ul className="list-group">
                    {store.budgets.map((budget) => (
                        <li key={budget.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                <strong>{budget.amount}</strong> - {budget.status} <br />
                                Proyecto ID: {budget.project_id}
                            </span>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(budget.id)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay presupuestos registrados.</p>
            )}
        </div>
    );
};

export default Budgets;
