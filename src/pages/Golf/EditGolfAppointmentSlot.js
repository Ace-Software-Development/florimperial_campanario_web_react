import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Datetime from 'react-datetime';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { getReservationGolf, getAllActiveUsers, getAllCoaches, updateGolfReservation } from '../../utils/client';
import { Button } from '@mui/material';
import GuestsSection from '../../components/GuestsSection';
import InputSelector from '../../components/InputSelector';
import "react-datetime/css/react-datetime.css";


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
        const updatedAppointment = {...appointment, [key]: data};
        setAppointment(updatedAppointment);
    }

    const onSubmit = () => {
        if (guests.length > maxGuests) {
			window.alert('Se ha rebasado el máximo de invitados en el horario seleccionado');
			return false;
		}
        const reservationData = {
            userId: appointment.user.id,
            objectId: appointment.id,
            estatus: 2
        };
        const reservationGolfData = {
            carritosReservados: golfAppointment.carritosReservados,
            cantidadHoyos: golfAppointment.cantidadHoyos
        };
        console.log("id : ", reservationData.objectId)
		//updateGolfReservation(reservationData, reservationGolfData, guests);
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
                                            value="JH5D3uksh0"
                                            name="sitio"
                                            defaultChecked={appointment.sitio == "Hoyo 1"}
                                            onChange={event => appointmentOnChange('reservacion', 'sitio',{nombre: "Hoyo 1", id: event.target.value})}
                                        />
                                        <label htmlFor={`${appointment.id}-hoyo1`}>Hoyo 1</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id={`${appointment.id}-hoyo10`}
                                            value="f9UD2GDs2e"
                                            name="sitio"
                                            defaultChecked={appointment.sitio == "Hoyo 10"}
                                            onChange={event => appointmentOnChange('reservacion', 'sitio', {nombre: "Hoyo 10", id: event.target.value})} 
                                            />
                                        <label htmlFor={`${appointment.id}-hoyo10`}>Hoyo 10</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id={`${appointment.id}-tee`}
                                            value="qGSxwr1OlI"
                                            name="sitio"
                                            defaultChecked={appointment.sitio == "Tee practica"}
                                            onChange={event => appointmentOnChange('reservacion', 'sitio', {nombre: "Tee de práctica", id: event.target.value})} 
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
                                    <InputSelector
                                        getDisplayText={i => i.username}
                                        getElementId={i => i.id}
                                        placeholder='Nombre del socio'
                                        defaultValue={appointment.user}
                                        onChange={user => appointmentOnChange('recervacion', 'user', user)}
                                        getListData={async () => {
                                            const response = await getAllActiveUsers();
                                            const data = [];
                                            response.forEach(i => {
                                                data.push({id: i.id, username: i.get('username')});
                                            });
                                            return data;
                                        }}
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
                                    <p>Coach disponible</p>
                                </td>
                                <td>
                                    <InputSelector
                                        getDisplayText={i => i.nombre}
                                        getElementId={i => i.id}
                                        placeholder='Nombre del coach'
                                        defaultValue={appointment.profesor}
                                        onChange={coach => appointmentOnChange('recervacion', 'profesor', coach)}
                                        getListData={async () => {
                                            const response = await getAllCoaches();
                                            const data = [];
                                            response.forEach(i => {
                                                data.push({id: i.id, nombre: i.get('nombre')});
                                            });
                                            return data;
                                        }}
                                    />
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
