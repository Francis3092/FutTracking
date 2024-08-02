import React, { useEffect, useState } from "react";
import supabase from "../../../../Configs/supabaseClient";
import { FaPencilAlt } from "react-icons/fa";
import "./index.css";

const MisDatos = () => {
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [naciones, setNaciones] = useState([]);

    useEffect(() => {
        fetchUserData();
        fetchNaciones();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data, error } = await supabase
                .from('perfil_jugadores')
                .select(`
                    id,
                    edad,
                    altura,
                    usuarios (
                        id,
                        email
                    ),
                    naciones (
                        id,
                        nombre
                    ),
                    provincias (
                        id,
                        nombre
                    )
                `)
                .eq('usuario_id', 11)
                .single();

            if (error) throw error;
            setUserData(data);
            setEditData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchNaciones = async () => {
        try {
            const { data, error } = await supabase
                .from('naciones')
                .select('*')
                .order('nombre');

            if (error) throw error;
            setNaciones(data);
        } catch (error) {
            console.error("Error fetching naciones:", error);
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('perfil_jugadores')
                .update({
                    edad: editData.edad,
                    altura: editData.altura,
                    nacion_id: editData.naciones.id,
                    provincia_id: editData.provincias.id
                })
                .eq('id', userData.id);

            if (error) throw error;

            const { error: userError } = await supabase
                .from('usuarios')
                .update({ email: editData.usuarios.email })
                .eq('id', userData.usuarios.id);

            if (userError) throw userError;

            setEditing(false);
            fetchUserData();
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mis-datos-container">
            <h2>Mis Datos <FaPencilAlt onClick={handleEdit} className="edit-icon" /></h2>
            {!editing ? (
                <div className="datos-list">
                    <p><strong>Nacionalidad:</strong> {userData.naciones.nombre}</p>
                    <p><strong>Correo electrónico:</strong> {userData.usuarios.email}</p>
                    <p><strong>Residencia:</strong> {userData.provincias.nombre}</p>
                    <p><strong>Edad:</strong> {userData.edad}</p>
                    <p><strong>Altura:</strong> {userData.altura} cm</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="edit-form">
                    <div>
                        <label>Nacionalidad:</label>
                        <select 
                            name="naciones.id" 
                            value={editData.naciones.id} 
                            onChange={handleChange}
                        >
                            {naciones.map(nacion => (
                                <option key={nacion.id} value={nacion.id}>{nacion.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Correo electrónico:</label>
                        <input 
                            type="email" 
                            name="usuarios.email" 
                            value={editData.usuarios.email} 
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Residencia:</label>
                        <input 
                            type="text" 
                            name="provincias.nombre" 
                            value={editData.provincias.nombre} 
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Edad:</label>
                        <input 
                            type="number" 
                            name="edad" 
                            value={editData.edad} 
                            onChange={handleChange}
                            min="0"
                            max="100"
                        />
                    </div>
                    <div>
                        <label>Altura:</label>
                        <input 
                            type="number" 
                            name="altura" 
                            value={editData.altura} 
                            onChange={handleChange}
                            min="120"
                            max="220"
                        />
                    </div>
                    <button type="submit">Guardar</button>
                </form>
            )}
        </div>
    );
}

export default MisDatos;