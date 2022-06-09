// W28
import React, { useEffect, useState, createRef } from 'react';
import CreateReservationClinic from './CreateReservationClinic';
import Screen from "../components/Screen";
import { getAllClinicsReservations, deleteClinic, updateClinicsReservations } from '../utils/client';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import MultipleUsers from '../components/MultipleUsers';
import Datetime from 'react-datetime';
import { DialogContent, DialogActions } from '@mui/material';
import { formatClinicDataRows } from '../utils/formatData';
import CirculoCarga from '../components/CirculoCarga';
import Table from 'react-bootstrap/Table';
import { Button } from '@mui/material';
import '../css/Clinics.css';

export default function EditReservationClinic(props) {
	const [clinic, setClinic] = useState(props.clinicData); 
	const [users, setUsers] = useState([]);
	const [disabledButton, setDisabledButton] = useState(false);
	const [deleteDisabledButton, setDeleteDisabledButton] = useState(false);

	const handleClose = () => {
		props.onClose(false);
	}

	const clinicOnChange = (key, data) => {
		const updatedClinic = {...clinic, [key]: data};
		setClinic(updatedClinic);
	}

	const handleDelete = async () => {
		await deleteClinic(clinic, users);
		return true;
	}

	const onSubmit = async () => {
        console.log(users);
        await updateClinicsReservations(clinic, users);
	}

    // useEffect(() => {console.log(clinic.fechaInicio)}, [])

	return (
		<Dialog open={props.open} onClose={handleClose} fullWidth={true} maxWidth="md">
			<DialogTitle>Editar Clinica</DialogTitle>
			<DialogContent>
				<div className="reservations-container">
					<div>
						<p><strong>Fecha de inicio</strong></p>
						{/* <Datetime
							inputProps={{className:'input'}}
							initialValue={clinic.fechaInicio}
							input={false}
							id={`${clinic.objectId}-datetime`}
							onChange={date => clinicOnChange('fechaInicio', new Date(date.toISOString()))} 
						/> */}
						<input 
                            type="date"
                            // value="2017-06-01"
                            id={`${clinic.objectId}-datetime`}
                            onChange={date => clinicOnChange('fechaInicio', new Date(date.target.value))} />
					</div>
					<div>
						<p><strong>Fecha de finalización</strong></p>
						{/*<Datetime
							inputProps={{className:'input'}}
							initialValue={appointment.start}
							input={false}
							id={`${appointment.objectId}-datetime`}
							onChange={date => appointmentOnChange('fechaInicio', new Date(date.toISOString()))} 
						/>*/}
						<input type="date"
                            // value="2017-06-01"
                            id={`${clinic.objectId}-datetime`}
                            onChange={date => clinicOnChange('fechaFin', new Date(date.target.value))} />
					</div>
					<div>
						<table>
							<tbody>
								<tr>
									<td>
										<p>Horario</p>
									</td>
									<td>
										<input type="time"
                                            onChange={time => clinicOnChange('horario', time.target.value)} />
									</td>
								</tr>

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
															// defaultChecked={appointment.sitio.objectId === sitio.objectId}
															// onChange={event => appointmentOnChange('sitio', {
															// 	nombre: sitio.nombre, 
															// 	objectId: event.target.value, 
															// 	variasReservaciones: sitio.variasReservaciones,
															// 	tableName: 'Sitio',
															// })}
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
											defaultValue={clinic.maximoJugadores}
											onChange={event => {
													clinicOnChange('maximoJugadores', parseInt(event.target.value));
												}
											} 
										/>
									</td>
								</tr>

							</tbody>
						</table>
						
						{/* Same logic for multiple users reservations as for guests */}
                        <div>
                        <MultipleUsers 
                            maxUsers={clinic.maximoJugadores} 
                            users={users} 
                            setUsers={setUsers} 
                            reservationId={clinic.objectId} 
                        />
                        </div>
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
							window.location.reload();
						}
					}} type="submit">Actualizar</Button>
				</DialogActions> 
			</DialogContent>
		</Dialog>
	);
}