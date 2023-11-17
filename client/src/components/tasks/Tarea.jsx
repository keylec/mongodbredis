import React, { useState } from "react";
import '../../hojas-de-estilo/Tarea.css';
import { AiOutlineCloseCircle, AiOutlineEdit, AiOutlineSave } from 'react-icons/ai';
import { updateTaskRequest } from "../../api/tasks";

function Tarea({ id, description, completada, completarTarea, eliminarTarea, editarTarea }) {
    const [editMode, setEditMode] = useState(false);
    const [editedText, setEditedText] = useState(description);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = async () => {
        try {
            const updatedTask = { description: editedText };
            await updateTaskRequest(id, updatedTask);
            setEditMode(false);
            editarTarea(id, editedText); // Comunicar al componente padre sobre la edición
        } catch (error) {
            console.error('Error al guardar la tarea editada:', error);
        }
    };
    // () => {
    //     setEditMode(false);
    //     // Lógica para actualizar la tarea con el texto editado
    //     // Puedes implementar una función para enviar el texto editado al componente padre
    //     // Y luego actualizar la tarea correspondiente en el estado del padre (ListaDeTareas)
    //     // Ejemplo:
    //     // updateTarea(id, editedText);
    // };

    const handleTextChange = (e) => {
        setEditedText(e.target.value);
    };

    return (
        <div className={completada ? 'tarea-contenedor completada' : 'tarea-contenedor'}>
            {editMode ? (
                <input
                    type="text"
                    value={editedText}
                    onChange={handleTextChange}
                    className='tarea-input-edit'
                />
            ) : (
                <div
                    className='tarea-texto'
                    onClick={() => completarTarea(id)}
                >
                    {description}
                </div>
            )}
            <div className='tarea-contenedor-iconos flex items-center'>
                {editMode ? (
                    <AiOutlineSave className='tarea-icono' onClick={handleSaveClick} />
                ) : (
                    <>
                        <AiOutlineEdit className='tarea-icono' onClick={handleEditClick} />
                        <AiOutlineCloseCircle className='tarea-icono' onClick={() => eliminarTarea(id)} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Tarea;