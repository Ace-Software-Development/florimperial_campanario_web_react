import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Datetime from 'react-datetime';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import "react-datetime/css/react-datetime.css";
import { getReservationGolf, updateGolfReservation } from '../../utils/client';
import { Button } from '@mui/material';
import GuestsSection from '../../components/GuestsSection';
import SocioSelector from '../../components/SocioSelector';

export default function EditGolfAppointmentSlot(props) {
    const [isLoading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(props.appointmentData);
    const [maxGuests, setMaxGuests] = useState(appointment.maximoJugadores);
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
    
    function appointmentOnChange(table, key, data) {
        const updatedAppointment = {...appointment, key: data};
        // console.log(table, key, data, updatedAppointment);
        console.log(updatedAppointment);
    }

    const onSubmit = async () => {
        if (guests.length > maxGuests) {
			window.alert('Se ha rebasado el máximo de invitados en el horario seleccionado');
			return false;
		}
        const reservationData = {
            userId: appointment.user.id,
            objectId: appointment.reservationId,
            estatus: 2
        };
        const reservationGolfData = {
            carritosReservados: appointment.carritosReservados,
            cantidadHoyos: appointment.cantidadHoyos
        };

		updateGolfReservation(appointment, reservationGolfData, guests);
    }

    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Editar Espacio de Reservación</DialogTitle>
            <DialogContent>
                <form>
                    <table>
                        <tbody>

                            <tr>
                                <td>
                                    <p>Fecha y hora</p>
                                </td>
                                <td>
                                    <Datetime
                                        inputProps={{className:'input'}}
                                        initialValue={appointment.start}
                                        id={`${appointment.id}-datetime`}
                                        onChange={date => appointmentOnChange('reservacion', 'fechaInicio', new Date(date.toISOString()))} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Sitio de salida</p>
                                </td>
                                <td>
                                    <div>
                                        <input
                                            type="radio"
                                            id={`${appointment.id}-hoyo1`}
                                            value="Hoyo 1"
                                            name="sitio"
                                            defaultChecked={appointment.hole == "Hoyo 1"}
                                            onChange={event => appointmentOnChange('reservacion', 'sitio', event.target.value)}
                                        />
                                        <label htmlFor={`${appointment.id}-hoyo1`}>Hoyo 1</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id={`${appointment.id}-hoyo10`}
                                            value="Hoyo 10"
                                            name="sitio"
                                            defaultChecked={appointment.hole == "Hoyo 10"}
                                            onChange={event => appointmentOnChange('reservacion', 'sitio', event.target.value)} 
                                            />
                                        <label htmlFor={`${appointment.id}-hoyo10`}>Hoyo 10</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id={`${appointment.id}-tee`}
                                            value="Tee"
                                            name="sitio"
                                            defaultChecked={appointment.hole == "Tee de practica"}
                                            onChange={event => appointmentOnChange('reservacion', 'sitio', event.target.value)} 
                                            />
                                        <label htmlFor={`${appointment.id}-tee`}>Tee de práctica</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Máximo asistentes</p>
                                </td>
                                <td>
                                    <input
                                        className='input'
                                        type="number"
                                        min="1"
                                        max="5"
                                        defaultValue={maxGuests}
                                        onChange={event => appointmentOnChange('reservacion', 'maximoJugadores', event.target.value)} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Socio que reservó</p>
                                </td>
                                <td>
                                    <SocioSelector
                                        defaultValue={appointment.user}
                                        onChange={user => appointmentOnChange('recervacion', 'user', user)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Carritos reservados</p>
                                </td>
                                <td>
                                    <input
                                        className='input'
                                        type="number"
                                        min="0"
                                        defaultValue={golfAppointment.carritosReservados}
                                        onChange={event => appointmentOnChange('reservacionGolf','carritosReservados', event.target.value)} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Estatus</p>
                                </td>
                                <td>
                                    <select className='input' defaultValue={appointment.estatus} onChange={event => appointmentOnChange('reservacion', 'estatus', event.target.value)}>
                                        <option value={1}>Disponible</option>
                                        <option value={2}>Reservado</option>
                                        <option value={3}>Reservado permanente</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Profesor/coach</p>
                                </td>
                                <td>
                                    <select className='input' defaultValue={appointment.estatus} onChange={event => appointmentOnChange('reservacion', 'estatus', event.target.value)}>
                                        <option value={1}>Disponible</option>
                                        <option value={2}>Reservado</option>
                                        <option value={3}>Reservado permanente</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <GuestsSection 
                        maxGuests={maxGuests} 
                        guests={guests} 
                        setGuests={setGuests} 
                        reservationId={appointment.id} />

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={onSubmit} type="submit">Actualizar</Button>
                    </DialogActions> 
                </form>
            </DialogContent>
        </Dialog>
    );
}
