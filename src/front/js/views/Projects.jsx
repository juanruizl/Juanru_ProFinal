import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const Projects = () => {
    const { store, actions } = useContext(Context);
    const [newProject, setNewProject] = useState({ name: "", description: "", start_date: "", end_date: "" });

    useEffect(() => {
        actions.getProjects();
    }, []);

    const handleChange = (e) => {
        setNewProject({ ...newProject, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const success = await actions.createProject(newProject);
        if (success) {
            setNewProject({ name: "", description: "", start_date: "", end_date: "" });
            actions.getProjects(); // Actualizar la lista
        }
    };

    const handleDelete = (id) => {
        actions.deleteProject(id);
    };

    return (
        <div className="container mt-4">
            <h1>Gestión de Proyectos</h1>

            <form onSubmit={handleCreate} className="mb-4">
                <h4>Crear nuevo proyecto</h4>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newProject.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={newProject.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha de Inicio</label>
                    <input
                        type="date"
                        className="form-control"
                        name="start_date"
                        value={newProject.start_date}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha de Fin</label>
                    <input
                        type="date"
                        className="form-control"
                        name="end_date"
                        value={newProject.end_date}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Crear</button>
            </form>

            <h4>Lista de Proyectos</h4>
            {store.projects?.length > 0 ? (
                <ul className="list-group">
                    {store.projects.map((project) => (
                        <li key={project.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                <strong>{project.name}</strong> <br />
                                {project.description}
                            </span>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(project.id)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay proyectos registrados.</p>
            )}
        </div>
    );
};

export default Projects;
