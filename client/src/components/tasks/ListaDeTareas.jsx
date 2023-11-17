import React, { useState, useEffect } from "react";
import TareaFormulario from "./TareaFormulario";
import '../../hojas-de-estilo/ListaDeTareas.css';
import Tarea from "./Tarea";
import {
    createTaskRequest,
    deleteTaskRequest,
    getTasksRequest,
    updateTaskRequest,
} from "../../api/tasks";

export function ListaDeTareas() {
    const [tareas, setTareas] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getTasksRequest();
                setTareas(response.data);
            } catch (error) {
                console.error('Error al obtener las tareas:', error);
            }
        };
        fetchTasks();
    }, []);

    const agregarTarea = async tarea => {
        console.log(tarea);
        try {
            const res = await createTaskRequest(tarea);
            setTareas([...tareas, res.data]); // Agregar la nueva tarea al estado
        } catch (error) {
            console.error('Error al agregar tarea:', error);
        }
    };

    const eliminarTarea = async id => {
        try {
            await deleteTaskRequest(id);
            const updatedTasks = tareas.filter(tarea => tarea._id !== id);
            setTareas(updatedTasks);
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
    };

    const completarTarea = async id => {
        try {
            const tareaToUpdate = tareas.find(tarea => tarea._id === id);
            const updatedTask = { ...tareaToUpdate, completada: !tareaToUpdate.completada };
            await updateTaskRequest(id, updatedTask);
            const updatedTasks = tareas.map(tarea =>
                tarea._id === id ? { ...tarea, completada: !tarea.completada } : tarea
            );
            setTareas(updatedTasks);
        } catch (error) {
            console.error('Error al completar tarea:', error);
        }
    };

    const editarTarea = async (id, editedText) => {
        try {
            const updatedTasks = tareas.map(tarea =>
                tarea._id === id ? { ...tarea, description: editedText } : tarea
            );
            setTareas(updatedTasks);
        } catch (error) {
            console.error('Error al editar la tarea:', error);
        }
    };

    return (
        <>
            <TareaFormulario onSubmit={agregarTarea} />
            <div className='tareas-lista-contenedor'>
                {
                    tareas.map((tarea) =>
                        <Tarea
                            key={tarea._id}
                            id={tarea._id}
                            description={tarea.description}
                            completada={tarea.completada}
                            eliminarTarea={eliminarTarea}
                            completarTarea={completarTarea}
                            editarTarea={editarTarea}
                        />
                    )
                }
            </div>
        </>
    );
}