// W28
import React, { useEffect, useState, createRef } from 'react';
import CreateReservationClinic from './CreateReservationClinic';
import Screen from "../components/Screen";
import EditReservationClinic from './EditReservationClinic';
import { getAllClinicsReservations } from '../utils/client';
import { formatClinicDataRows } from '../utils/formatData';
import { toDateString } from '../utils/dateHelpers';
import CirculoCarga from '../components/CirculoCarga';
import Table from 'react-bootstrap/Table';
import '../css/Clinics.css';

export default function ReservationsClinicas(props) {
    const [loading, setLoading] = useState(true);
	const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
	const [clinicsData, setClinicsData] = useState([]);
	const [selectedClinic, setSelectedClinic] = useState(null);

	useEffect(async () => {
		const data = await getAllClinicsReservations(props.module);
		console.log(data.id);
		// const usersData = await getReservacionClinica(data.get())
		const parsedData = [];
		data.forEach(i => {
			const formatedData = formatClinicDataRows(i);
			parsedData.push(formatedData);
		});
		setClinicsData(parsedData);
		setLoading(false);
	}, []);

	const handleEditClick = event => {
		let clinicObj = [];
		clinicsData.forEach(clinic => {if(clinic.objectId === event.target.value) clinicObj = clinic});
		setSelectedClinic(clinicObj);
		setOpenEdit(true);
	}

	// const handleDelete = async () => {
	// 	await deleteClinic(clinic, users);
	// 	return true;
	// }

	return (
		<Screen title={props.screenTitle} screenPath={props.screenPath}>
			<button 
				className="primary-btn"
				onClick={() => setOpenCreate(true)}
			>
				Crear clase
			</button>

			<Table striped bordered hover>
				<thead>
					<tr>
						<td>Nombre de la clínica</td>
						<td>Cupo máx.</td>
						<td>Hora</td>
						<td>Días</td>
						<td>Fecha inicio</td>
						<td>Fecha fin</td>
						<td>Acciones</td>
					</tr>
				</thead>

				<tbody>
					{clinicsData.map(row => {
						return (
							<tr key={`${row.objectId}-tr`}>
								<td key={`${row.objectId}-td-1`}>{row.nombre}</td>
								<td key={`${row.objectId}-td-2`}>{row.maximoJugadores}</td>
								<td key={`${row.objectId}-td-4`}>{row.horario}</td>
								<td key={`${row.objectId}-td-5`}>{row.dias}</td>
								<td key={`${row.objectId}-td-6`}>{toDateString(row.fechaInicio)}</td>
								<td key={`${row.objectId}-td-7`}>{toDateString(row.fechaFin)}</td>
								<td key={`${row.objectId}-td-8`}>
									<button key={`${row.objectId}-btn-edit`} value={row.objectId} onClick={event => handleEditClick(event)}>Editar</button>
								</td>
							</tr>
						)
					})
					}
				</tbody>
			</Table>

			{openEdit &&
				<EditReservationClinic 
					onClose={setOpenEdit}
					open={openEdit}
					sitios={props.sitios}
					clinicData={selectedClinic}
				/>
			}

			{openCreate && 
				<CreateReservationClinic 
					onClose={setOpenCreate}
					open={openCreate}
					sitios={props.sitios}
				/>
			}
		</Screen>
	);
}
