export function formatReservationData(reservation, golfReservation=null, multipleReservations=null){
	let title = '';
	if (reservation.get('estatus') === 1)
		title = 'Disponible';
	else if (reservation.get('sitio').get('variasReservaciones') && multipleReservations.length>=reservation.get('maximoJugadores'))
		title = 'Cupo lleno';
	else if (reservation.get('user')===undefined && reservation.get('estatus') !== 1)
		title = 'Bloqueado';
	else
		title = reservation.get('user').get('username');

	const formatedData = {
		objectId: reservation.id,
		id: reservation.id,
		title: title,
		start: reservation.get('fechaInicio'),
		estatus: reservation.get('estatus'),
		maximoJugadores: reservation.get('maximoJugadores'),
		sitio: {
			objectId: reservation.get('sitio').id,
			nombre: reservation.get('sitio').get('nombre'),
			variasReservaciones: reservation.get('sitio').get('variasReservaciones'),
			tableName: 'Sitio',
		},
		profesor: reservation.get('profesor') ? {
			objectId: reservation.get('profesor').id,
			nombre: reservation.get('profesor').get('nombre'),
			tableName: 'Profesor',
		} : null,
		user: reservation.get('user') ? {
			objectId: reservation.get('user').id,
			username: reservation.get('user').get('username'),
			tableName: 'User'
		} : null,
		golfAppointment: golfReservation ? {
			objectId: golfReservation.id,
			carritosReservados: golfReservation.get('carritosReservados'),
			cantidadHoyos: golfReservation.get('cantidadHoyos'),
			reservacion: {
				objectId: reservation.id
			},
		} : null,
		multipleReservation: multipleReservations && multipleReservations.length>0 ? multipleReservations.map(reservation => {
			return {
				objectId: reservation.id,
				user: {
					objectId: reservation.get('user').id,
					username: reservation.get('user').get('username'),
				},
				reservacion: {
					objectId: reservation.get('reservacion').id
				},
			};
		}) : null
	}
	return formatedData;
}

export function formatSitioData(sitio) {
	return {
		objectId: sitio.id,
		nombre: sitio.get('nombre'),
		variasReservaciones: sitio.get('variasReservaciones'),
		tableName: 'Sitio'
	};
}

export function formatClinicDataRows(clinic){
	return {
		objectId: clinic.id,
		nombre: clinic.get('nombre'),
		maximoJugadores: clinic.get('maximoJugadores'),
		horario: clinic.get('horario'),
		fechaInicio: clinic.get('fechaInicio'),
		fechaFin: clinic.get('fechaFin'),
		dias: clinic.get('dias'),
		sitio: {
			objectId: clinic.get('sitio').id,
			nombre: clinic.get('sitio').get('nombre'),
			tableName: 'Sitio',
		},
		area: {
			objectId: clinic.get('sitio').get('area').id,
			nombre: clinic.get('sitio').get('area').get('nombre'),
			tableName: 'Area'
		}
	};
}