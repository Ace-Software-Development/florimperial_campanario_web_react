import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import CirculoCarga from "../../components/CirculoCarga";
import { getReservationGolf } from '../../utils/client';

export default function EditGolfAppointmentSlot(props) {
    const [isLoading, setLoading] = useState(true);
    const [golfAppointment, setGolfAppointment] = useState(null);
    const [appointment, setAppointment] = useState(props.appointmentData);
    const [holeOneChecked, setHoleOneChecked] = useState(false);
    const { register, handleSubmit } = useForm();

    useEffect(async () => {
        try {
            const appointments = await getReservationGolf(props.appointment.id);
            setGolfAppointment(appointments);
        } catch(error){
            console.log(error);
        }
        setLoading(false);
    }, []);

    const handleClose = () => {
       // window.location.reload();
        props.onClose(false);
    }
    
    // 4. Ya que este todo guardado, en editAppointmentSlot() vamos a settear las variables del objeto de ReservacionGolf, Reservacion, ReservacionInvitado
    async function editAppointmentSlot(data) {
        // 5. Guardar cambios de ReservacionGolf

        // EXTRA: Checar pases. Una idea es hacer una tabla de pases(fecha, pointer a user, pointer a invitado, usado)
            // Con la tabla ya solamente tenemos que consultar si hay un pase para cierto invitado en cierto dia. No se asigna el pase para actividad sino al dia

        // Ejemplo de funciones anidadas: CreateGolfAppointmentSlot.js
        // BUGS: Desde la vista de mes no se crea bien la reservacion, desde la de dia si. Es por la fecha. Igual en ambas la fecha aparece diferente en el dialogo. 
    }
    
    // if (user.get("username") == undefined)
    // return (
    //     <Dialog open={props.open} onClose={handleClose} >
    //     <DialogTitle>Editar Espacio de Reservación</DialogTitle>
    //     <DialogContent>     
    //         <CirculoCarga/>
    //     </DialogContent>
    // </Dialog>
    // );
    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Editar Espacio de Reservación</DialogTitle>
            <DialogContent> 
                
            </DialogContent>
        </Dialog>
    );
}