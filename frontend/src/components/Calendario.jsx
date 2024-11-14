import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import axios from 'axios';

const Calendario = ({ open, onClose, onDateClick, selectedDate }) => {
    // Estado para almacenar fechas en las que no hay horarios disponibles
    const [fechasSinHorarios, setFechasSinHorarios] = useState([]);
    // Estado para almacenar la fecha seleccionada actualmente
    const [diaActual, setDiaActual] = useState(null);

    // Función asíncrona que obtiene fechas sin horarios disponibles desde la API
    const fetchFechasSinHorarios = async () => {
        try {
            // Llamada a la API para obtener fechas sin horarios
            const response = await axios.get('http://localhost:3000/fechas-sin-horarios');
            console.log(response.data.fechasSinHorarios);
            // Convertir las fechas a strings y actualizar el estado
            const fechas = response.data.fechasSinHorarios.map(date => date.toString());
            setFechasSinHorarios(fechas);
        } catch (error) {
            console.error('Error al traer fechas sin horarios:', error);
        }
    };

    // useEffect para obtener fechas sin horarios cuando el componente se monta
    useEffect(() => {
        fetchFechasSinHorarios();
    }, []);

    // useEffect para actualizar `diaActual` cuando cambia `selectedDate`
    useEffect(() => {
        if (selectedDate) {
            setDiaActual(new Date(selectedDate));
        }
    }, [selectedDate]);

    // Función que maneja la selección de una fecha
    const handleDateClick = async (date) => {
        // Obtener el día de la semana y evitar seleccionar fines de semana
        const diaDeSemana = date.getDay();
        if (diaDeSemana === 0 || diaDeSemana === 6) {
            alert('No atendemos fines de semana');
            return;
        }
        // Actualizar el día actual y llamar al evento `onDateClick`
        setDiaActual(date);
        onDateClick(date);
        onClose(); // Cerrar el diálogo al seleccionar una fecha
    };

    // Deshabilitar fechas en el calendario que son anteriores a la fecha actual
    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            return date < new Date().setHours(0, 0, 0, 0);
        }
        return false;
    };

    // Añadir clases de estilo condicionalmente para fechas sin horarios
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Evitar aplicar estilos a fechas anteriores a hoy
            if (date < today) {
                return '';  
            }

            // Formatear la fecha y verificar si está en `fechasSinHorarios`
            const formattedDate = date.toISOString().split('T')[0];
            if (fechasSinHorarios.includes(formattedDate)) {
                return 'no-horarios'; // Añadir clase 'no-horarios' para personalizar estilos en CSS
            }
        }
        return '';
    };

    return (
        // Diálogo que muestra el calendario
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Seleccione una fecha</DialogTitle>
            <DialogContent>
                {/* Componente de calendario con configuraciones y eventos */}
                <Calendar 
                    onClickDay={handleDateClick} 
                    locale='es' 
                    tileDisabled={tileDisabled} 
                    tileClassName={tileClassName}
                    value={diaActual}
                />
            </DialogContent>
        </Dialog>
    );
};

export default Calendario;
