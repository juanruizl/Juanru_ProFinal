import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const Transactions = () => {
    const { store, actions } = useContext(Context);
    const [newTransaction, setNewTransaction] = useState({ amount: "", transaction_type: "", description: "" });

    useEffect(() => {
        actions.getTransactions();
    }, []);

    const handleChange = (e) => {
        setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const success = await actions.createTransaction(newTransaction);
        if (success) {
            setNewTransaction({ amount: "", transaction_type: "", description: "" });
            actions.getTransactions(); // Actualizar la lista
        }
    };

    const handleDelete = (id) => {
        actions.deleteTransaction(id);
    };

    return (
        <div className="container mt-4">
            <h1>Gestión de Transacciones</h1>

            <form onSubmit={handleCreate} className="mb-4">
                <h4>Crear nueva transacción</h4>
                <div className="mb-3">
                    <label className="form-label">Monto</label>
                    <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={newTransaction.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo de transacción</label>
                    <input
                        type="text"
                        className="form-control"
                        name="transaction_type"
                        value={newTransaction.transaction_type}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <input
                        type="text"
                        className="form-control"
                        name="description"
                        value={newTransaction.description}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Crear</button>
            </form>

            <h4>Lista de Transacciones</h4>
            {store.transactions.length > 0 ? (
                <ul className="list-group">
                    {store.transactions.map((transaction) => (
                        <li key={transaction.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                <strong>{transaction.amount}</strong> - {transaction.transaction_type} <br />
                                {transaction.description}
                            </span>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(transaction.id)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay transacciones registradas.</p>
            )}
        </div>
    );
};

export default Transactions;
