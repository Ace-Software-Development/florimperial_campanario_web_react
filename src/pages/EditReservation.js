import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Datetime from 'react-datetime';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { getAllActiveUsers, getAllCoaches, updateReservation, deleteReservation } from '../utils/client';
import { Button } from '@mui/material';
import GuestsSection from '../components/GuestsSection';
import MultipleUsers from '../components/MultipleUsers';
import InputSelector from '../components/InputSelector';
import 'react-datetime/css/react-datetime.css';

export default function EditGolfAppointmentSlot(props) {
	const [appointment, setAppointment] = useState(props.appointmentData);
    const [maxGuests, setMaxGuests] = useState(appointment.maximoJugadores);
	const [guests, setGuests] = useState([]);
	const [users, setUsers] = useState([]);
	const [disabledButton, setDisabledButton] = useState(false);
	const [deleteDisabledButton, setDeleteDisabledButton] = useState(false);
    
	const handleClose = () => {
        props.onClose(false);
    }
    
    function appointmentOnChange(key, data) {
        const updatedAppointment = {...appointment, [key]: data};
        setAppointment(updatedAppointment);
    }

	const handleDelete = async () => {
		await deleteReservation(appointment, guests);
		return true;
	}

    const onSubmit = async () => {
		// Validaciones
		if (appointment.user && appointment.user.objectId && appointment.estatus === 1) {
			window.alert('No se puede tener un estatus "Disponible" y tener un socio asignado');
			return false;
		}

        if (guests.length > maxGuests) {
            window.alert('Se ha rebasado el máximo de invitados.');
            return false;
        }

		if (users.length > maxGuests) {
            window.alert('Se ha rebasado el máximo de reservaciones.');
            return false;
        }

		if (appointment.sitio.variasReservaciones && users.length+guests.length === maxGuests) {
			appointment.estatus = 2;
		}

        // Parse data so it matches DB fields
        delete appointment.start;
        delete appointment.title;
        delete appointment.id;
        delete appointment.multipleReservation;
		await updateReservation(appointment, guests, users);
		return true;
    }

    return(
        <Dialog open={props.open} onClose={handleClose} fullWidth={true} maxWidth="md">
            <DialogTitle>Editar Espacio de Reservación</DialogTitle>
            <DialogContent>
				<div className="reservations-container">
					<div>
						<p><strong>Fecha y hora</strong></p>
						<Datetime
							inputProps={{className:'input'}}
							initialValue={appointment.start}
							input={false}
							id={`${appointment.objectId}-datetime`}
							onChange={date => appointmentOnChange('fechaInicio', new Date(date.toISOString()))} 
						/>
					</div>
					<div>
						<table>
							<tbody>
								{props.sitios && props.sitios.length > 1 &&
									<tr>
										<td>
											<p>Sitio de salida</p>
										</td>
										<td>
											{props.sitios.map(sitio => {
												return(
													<div key={`${sitio.objectId}-sitio-div`}>
														<input
															key={`${sitio.objectId}-sitio-input`}
															type="radio"
															id={sitio.objectId}
															value={sitio.objectId}
															name="sitio"
															defaultChecked={appointment.sitio.objectId === sitio.objectId}
															onChange={event => appointmentOnChange('sitio', {
																nombre: sitio.nombre, 
																objectId: event.target.value, 
																variasReservaciones: sitio.variasReservaciones,
																tableName: 'Sitio',
															})}
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
											onChange={event => {
													appointmentOnChange('maximoJugadores', parseInt(event.target.value));
													setMaxGuests(parseInt(event.target.value));
												}
											} 
										/>
									</td>
								</tr>

								{!appointment.sitio.variasReservaciones &&
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
														objectId: appointment.objectId
													}
												})} 
											/>
										</td>
									</tr>
								}
								
								{appointment.golfAppointment &&
									<tr>
										<td>
											<p>Hoyos a jugar</p>
										</td>
										<td>
											<select 
												defaultValue={appointment.golfAppointment.cantidadHoyos} 
												onChange={event => appointmentOnChange('golfAppointment', {
													objectId: appointment.golfAppointment.objectId,
													carritosReservados: appointment.golfAppointment.carritosReservados,
													cantidadHoyos: parseInt(event.target.value),
													reservacion: {
														objectId: appointment.objectId
													}
												})} 
											>
												<option value={9}>9</option>
												<option value={18}>18</option>
											</select>
										</td>
									</tr>
								}
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
							</tbody>
						</table>
						
						{/* Same logic for multiple users reservations as for guests */}
						{appointment.sitio.variasReservaciones &&
							<MultipleUsers 
								maxUsers={maxGuests} 
								users={users} 
								setUsers={setUsers} 
								reservationId={appointment.objectId} 
							/>
						}

						{props.guestsInput &&
							<GuestsSection 
								maxGuests={maxGuests} 
								guests={guests} 
								setGuests={setGuests} 
								reservationId={appointment.objectId} 
							/>
						}
					</div>
				</div>

				<DialogActions>
					<Button onClick={handleClose}>Cancelar</Button>
					<Button onClick={async () => {
						if (deleteDisabledButton)
							return;
						const status = await handleDelete();
						if (status) {
							setDeleteDisabledButton(true);
							window.location.reload();
						}
					}}>Eliminar</Button>
					<Button onClick={async () => {
						if(disabledButton)
							return;
						const status = await onSubmit();
						if (status) {
							setDisabledButton(true);
							//window.location.reload();
						}
					}} type="submit">Actualizar</Button>
				</DialogActions> 
            </DialogContent>
        </Dialog>
    );
}
