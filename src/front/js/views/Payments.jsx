import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const Payments = () => {
    const { store, actions } = useContext(Context);
    const [newPayment, setNewPayment] = useState({ amount: "", recipient: "" });

    useEffect(() => {
        actions.getPayments();
    }, []);

    const handleChange = (e) => {
        setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const success = await actions.createPayment(newPayment);
        if (success) {
            setNewPayment({ amount: "", recipient: "" });
            actions.getPayments(); // Actualizar la lista
        }
    };

    const handleDelete = (id) => {
        actions.deletePayment(id);
    };

    return (
        <div className="container mt-4">
            <h1>Gestión de Pagos</h1>

            <form onSubmit={handleCreate} className="mb-4">
                <h4>Crear nuevo pago</h4>
                <div className="mb-3">
                    <label className="form-label">Monto</label>
                    <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={newPayment.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Destinatario</label>
                    <input
                        type="text"
                        className="form-control"
                        name="recipient"
                        value={newPayment.recipient}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Crear</button>
            </form>

            <h4>Lista de Pagos</h4>
            {store.payments?.length > 0 ? (
                <ul className="list-group">
                    {store.payments.map((payment) => (
                        <li key={payment.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                <strong>{payment.amount}</strong> - {payment.recipient}
                            </span>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(payment.id)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay pagos registrados.</p>
            )}
        </div>
    );
};

export default Payments;
