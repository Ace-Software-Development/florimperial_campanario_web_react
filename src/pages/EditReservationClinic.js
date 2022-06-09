// W28
import React, { useEffect, useState, createRef } from 'react';
import CreateReservationClinic from './CreateReservationClinic';
import Screen from "../components/Screen";
import { getAllClinicsReservations, deleteClinic } from '../utils/client';
import { formatClinicDataRows } from '../utils/formatData';
import CirculoCarga from '../components/CirculoCarga';
import Table from 'react-bootstrap/Table';
import '../css/Clinics.css';

export default function EditReservationClinic(props) {
	//const [clinic, setClinic] = useState(props.cinicData); // comprobar que así se llame el prop
	//const [users, setUsers] = useState([]);
	//const [disabledButton, setDisabledButton] = useState(false);
	//const [deleteDisabledButton, setDeleteDisabledButton] = useState(false);

	//const handleClose = () => {
	//	props.onClose(false);
	//}

	//const clinicOnChange = (key, data) => {
	//	const updatedClinic = {...clinic, [key]: data};
	//	setClinic(updatedClinic);
	//}

	//const handleDelete = async () => {
	//	await deleteClinic(clinic, users);
	//	return true;
	//}

	//const onSubmit = async () => {

	//}

	//return (
	//	<Dialog open={props.open} onClose={handleClose} fullWidth={true} maxWidth="md">
	//		<DialogTitle>Editar Clinica</DialogTitle>
	//		<DialogContent>
	//			<div className="reservations-container">
	//				<div>
	//					<p><strong>Fecha de inicio</strong></p>
	//					{/*<Datetime
	//						inputProps={{className:'input'}}
	//						initialValue={appointment.start}
	//						input={false}
	//						id={`${appointment.objectId}-datetime`}
	//						onChange={date => appointmentOnChange('fechaInicio', new Date(date.toISOString()))} 
	//					/>*/}
	//					<input type="date" />
	//				</div>
	//				<div>
	//					<p><strong>Fecha de finalización</strong></p>
	//					{/*<Datetime
	//						inputProps={{className:'input'}}
	//						initialValue={appointment.start}
	//						input={false}
	//						id={`${appointment.objectId}-datetime`}
	//						onChange={date => appointmentOnChange('fechaInicio', new Date(date.toISOString()))} 
	//					/>*/}
	//					<input type="date" />
	//				</div>
	//				<div>
	//					<table>
	//						<tbody>
	//							<tr>
	//								<td>
	//									<p>Horario</p>
	//								</td>
	//								<td>
	//									<input type="time" />
	//								</td>
	//							</tr>

	//							{props.sitios && props.sitios.length > 1 &&
	//								<tr>
	//									<td>
	//										<p>Sitio de salida</p>
	//									</td>
	//									<td>
	//										{props.sitios.map(sitio => {
	//											return(
	//												<div key={`${sitio.objectId}-sitio-div`}>
	//													<input
	//														key={`${sitio.objectId}-sitio-input`}
	//														type="radio"
	//														id={sitio.objectId}
	//														value={sitio.objectId}
	//														name="sitio"
	//														defaultChecked={appointment.sitio.objectId === sitio.objectId}
	//														onChange={event => appointmentOnChange('sitio', {
	//															nombre: sitio.nombre, 
	//															objectId: event.target.value, 
	//															variasReservaciones: sitio.variasReservaciones,
	//															tableName: 'Sitio',
	//														})}
	//													/>
	//													<label htmlFor={sitio.objectId}>{sitio.nombre}</label>
	//												</div>
	//												);
	//											})
	//										}
	//									</td>
	//								</tr>
	//							}

	//							<tr>
	//								<td>
	//									<p>Máximo asistentes</p>
	//								</td>
	//								<td>
	//									<input
	//										className='input'
	//										type="number"
	//										min="1"
	//										defaultValue={maxGuests}
	//										onChange={event => {
	//												appointmentOnChange('maximoJugadores', parseInt(event.target.value));
	//												setMaxGuests(parseInt(event.target.value));
	//											}
	//										} 
	//									/>
	//								</td>
	//							</tr>

	//						</tbody>
	//					</table>
						
	//					{/* Same logic for multiple users reservations as for guests */}
	//					{appointment.sitio.variasReservaciones &&
	//						<MultipleUsers 
	//							maxUsers={maxGuests} 
	//							users={users} 
	//							setUsers={setUsers} 
	//							reservationId={appointment.objectId} 
	//						/>
	//					}

	//					{props.guestsInput &&
	//						<GuestsSection 
	//							maxGuests={maxGuests} 
	//							guests={guests} 
	//							setGuests={setGuests} 
	//							reservationId={appointment.objectId} 
	//						/>
	//					}
	//				</div>
	//			</div>
	//			<DialogActions>
	//				<Button onClick={handleClose}>Cancelar</Button>
	//				<Button onClick={async () => {
	//					if (deleteDisabledButton)
	//						return;
	//					const status = await handleDelete();
	//					if (status) {
	//						setDeleteDisabledButton(true);
	//						window.location.reload();
	//					}
	//				}}>Eliminar</Button>
	//				<Button onClick={async () => {
	//					if(disabledButton)
	//						return;
	//					const status = await onSubmit();
	//					if (status) {
	//						setDisabledButton(true);
	//						window.location.reload();
	//					}
	//				}} type="submit">Actualizar</Button>
	//			</DialogActions> 
	//		</DialogContent>
	//	</Dialog>
	//);
}