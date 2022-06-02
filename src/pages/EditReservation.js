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
    const [appointment, setAppointment] = useState(props.appointmentData);
    const [maxGuests, setMaxGuests] = useState(appointment.maximoJugadores);
    const [guests, setGuests] = useState([]);
	const [disabledButton, setDisabledButton] = useState(false);

    useEffect(async () => {
    }, []);

    const handleClose = () => {
        props.onClose(false);
    }
    
    function appointmentOnChange(key, data) {
        const updatedAppointment = {...appointment, [key]: data};
        setAppointment(updatedAppointment);
    }

    const onSubmit = () => {
        if (guests.length > maxGuests) {
            window.alert('Se ha rebasado el máximo de invitados.');
            return false;
        }

        // Parse data so it matches DB fields
        delete appointment.start;
        delete appointment.title;
        delete appointment.id;
        
        appointment.reservacionGolf = golfAppointment;
        updateGolfReservation(appointment, guests).then(() => window.location.reload());
    }

    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Editar Espacio de Reservación</DialogTitle>
            <DialogContent>
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
									input={false}
									id={`${appointment.objectId}-datetime`}
									onChange={date => appointmentOnChange('fechaInicio', new Date(date.toISOString()))} 
								/>
							</td>
						</tr>

						{props.sitios.length > 1 &&
							<tr>
								<td>
									<p>Sitio de salida</p>
								</td>
								<td>
									{props.sitios.map(sitio => {
										return(
											<div>
												<input
													type="radio"
													id={sitio.objectId}
													value={sitio.objectId}
													name="sitio"
													defaultChecked={appointment.sitio.objectId === sitio.objectId}
													onChange={event => appointmentOnChange('sitio', {nombre: sitio.nombre, objectId: event.target.value, tableName: 'Sitio'})}
												/>
												<label htmlFor={sitio.objectId}>{sitio.nombre}</label>
											</div>
											);
										})
									}
								</td>
							</tr>
						}

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
									onChange={event => appointmentOnChange('maximoJugadores', parseInt(event.target.value))} 
								/>
							</td>
						</tr>

						{props.appointment.user &&
							<tr>
								<td>
									<p>Socio que reservó</p>
								</td>
								<td>
									<InputSelector
										getDisplayText={i => i.username}
										getElementId={i => i.objectId}
										placeholder='Nombre del socio'
										defaultValue={appointment.user}
										onChange={user => appointmentOnChange('user', user)}
										getListData={async () => {
											const response = await getAllActiveUsers();
											const data = [];
											response.forEach(i => {
												data.push({objectId: i.id, username: i.get('username'), tableName: 'User'});
											});
											return data;
										}}
									/>
								</td>
							</tr>
						}

						{appointment.golfAppointment &&
							<tr>
								<td>
									<p>Carritos reservados</p>
								</td>
								<td>
									<input
										className='input'
										type="number"
										min="0"
										defaultValue={appointment.golfAppointment.carritosReservados}
										onChange={event => appointmentOnChange('golfAppointment', {
											objectId: appointment.golfAppointment.objectId,
											carritosReservados: parseInt(event.target.value),
											cantidadHoyos: appointment.golfAppointment.cantidadHoyos,
											reservacion: {
												objectId: appointment.golfAppointment.reservacion.objectId
											}
										})} 
									/>
								</td>
							</tr>
						}

						<tr>
							<td>
								<p>Estatus</p>
							</td>
							<td>
								<select className='input' defaultValue={appointment.estatus} onChange={event => appointmentOnChange('estatus', parseInt(event.target.value))}>
									<option value={1}>Disponible</option>
									<option value={2}>Reservado</option>
									<option value={3}>Reservado permanente</option>
								</select>
							</td>
						</tr>

						{props.coachInput &&
							<tr>
								<td>
									<p>Coach disponible</p>
								</td>
								<td>
									<InputSelector
										getDisplayText={i => i.nombre}
										getElementId={i => i.objectId}
										placeholder='Nombre del coach'
										defaultValue={appointment.profesor}
										onChange={coach => {appointmentOnChange('profesor', coach)}}
										getListData={async () => {
											const response = await getAllCoaches();
											const data = [];
											response.forEach(i => {
												data.push({objectId: i.id, nombre: i.get('nombre'), tableName: 'Profesor'});
											});
											return data;
										}}
									/>
								</td>
							</tr>
						}
					</tbody>
				</table>

				{props.guestsInput &&
					<GuestsSection 
						maxGuests={maxGuests} 
						guests={guests} 
						setGuests={setGuests} 
						reservationId={appointment.objectId} 
					/>
				}

				<DialogActions>
					<Button onClick={handleClose}>Cancelar</Button>
					<Button onClick={() => {
						if(disabledButton)
							return;
						setDisabledButton(true);
						onSubmit();
					}} type="submit">Actualizar</Button>
				</DialogActions> 
            </DialogContent>
        </Dialog>
    );
}
