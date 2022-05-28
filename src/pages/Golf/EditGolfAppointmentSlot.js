import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Datetime from 'react-datetime';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { useForm } from 'react-hook-form';
import "react-datetime/css/react-datetime.css";
import { getReservationGolf } from '../../utils/client';
import { Button } from '@mui/material';
import GuestsSection from '../../components/GuestsSection';

export default function EditGolfAppointmentSlot(props) {
    const [isLoading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(props.appointmentData);
    const [maxGuests, setMaxGuests] = useState(appointment.maximoJugadores);
    const { register, handleSubmit } = useForm();
    const [guests, setGuests] = useState([]);
    const [golfAppointment, setGolfAppointment] = useState({
                    id: null,
                    reservationId: null,
                    carritosReservados: 0,
                    cantidadHoyos: 9
                });

    useEffect(async () => {
        try {
            const appointment = await getReservationGolf(props.appointmentData.id);
            if (appointment){
                const appointmentParsed = {
                    id: appointment.id,
                    reservationId: appointment.get('reservacion').id,
                    carritosReservados: appointment.get('carritosReservados'),
                    cantidadHoyos: appointment.get('cantidadHoyos')
                };
                setGolfAppointment(appointmentParsed);
            }
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
                <form onSubmit={handleSubmit(editAppointmentSlot)}>
                    <table>
                        <tbody>

                            <tr>
                                <td>
                                    <p>Fecha y hora</p>
                                </td>
                                <td>
                                    <Datetime 
                                        value={appointment.start}
                                        id={`${appointment.id}-datetime`}
                                        //onChange={date => setStartingDate(date)} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Hoyo de salida</p>
                                </td>
                                <td>
                                    <div>
                                        <input
                                            type="radio"
                                            id={`${appointment.id}-hoyo1`}
                                            value="Hoyo 1"
                                            defaultChecked={appointment.hole == "Hoyo 1"}
                                            //onChange={hole => changeStartingHole('Hoyo 1', true)}
                                            />
                                        <label htmlFor={`${appointment.id}-hoyo1`}>Hoyo 1</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id={`${appointment.id}-hoyo10`}
                                            value="Hoyo 10"
                                            defaultChecked={appointment.hole == "Hoyo 10"}
                                            //onChange={hole => changeStartingHole('Hoyo 10', true)}
                                            />
                                        <label htmlFor={`${appointment.id}-hoyo10`}>Hoyo 10</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Máximo asistentes</p>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        defaultValue={maxGuests}
                                        onChange={newMax => setMaxGuests(newMax)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Socio que reservó</p>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={appointment.user ? appointment.user.name : ''}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Carritos reservados</p>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        defaultValue={golfAppointment.carritosReservados}
                                        //onChange={newKarts => changeReserveredKarts(newKarts)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Estatus</p>
                                </td>
                                <td>
                                    <select defaultValue={appointment.estatus}>
                                        <option value={1}>Disponible</option>
                                        <option value={2}>Reservado</option>
                                        <option value={3}>Reservado permanente</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <GuestsSection maxGuests={maxGuests} guests={guests} setGuests={setGuests} />

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit">Actualizar</Button>
                    </DialogActions> 
                </form>
            </DialogContent>
        </Dialog>
    );
}