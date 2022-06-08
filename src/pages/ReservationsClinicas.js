// W28
import React, { useEffect, useState, createRef } from 'react';
import CreateReservationSlot from './CreateReservationSlot';
import Screen from "../components/Screen";
import EditReservationClinic from './EditReservationClinic';
import { getAllAvailableReservations } from '../utils/client';
import CirculoCarga from '../components/CirculoCarga';

export default function ReservationsClinicas(props) {
    const [loading, setLoading] = useState(true);
	const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
	const [clinicsData, setClinicsData] = useState([]);
	const [selectedClinic, setSelectedClinic] = useState([]);

	useEffect(async () => {
		getAllClinicsReservations(props.module)
		.then(data => {
			const formatedData = formatClinicDataRows(data);
			setClinicsData(formatedData);
			setLoading(false);
		})
		.catch(error => {
			setLoading(false);
			console.log(error);
			window.alert('Ha ocurrido un error, intente volver a cargar la página');
		});
	}, []);

	return (
		<Screen title={props.screenTitle} screenPath={props.screenPath}>
			<table>
				<thead>
					<tr>
						<td>Nombre de la clínica</td>
						<td>Cupo actual</td>
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
							<tr>
								<td>{row.nombre}</td>
								<td>{row.maximoJugadores}</td>
								<td>?</td> 
								<td>{row.horario}</td>
								<td>{row.dias}</td>
								<td>{row.fechaInicio}</td>
								<td>{row.fechaFin}</td>
								<td>
									<button>Editar</button>
									<button>Eliminar</button>
								</td>
							</tr>
						)
					})
					}
				</tbody>
			</table>

			{openEdit &&
				<EditReservationClinic />
			}
		</Screen>
	);
}
