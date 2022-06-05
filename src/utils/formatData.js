export function formatReservationData(reservation, golfReservation=null, multipleReservations=null){
	let title = '';
	if (reservation.get('estatus') === 1)
		title = 'Disponible';
	else if (reservation.get('user')===undefined || reservation.get('estatus') !== 1)
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
		multipleReservation: multipleReservations ? {
			multipleReservations
		} : null
	}
	return formatedData;
}

export function formatSitioData(sitio) {
	return {
		objectId: sitio.id,
		nombre: sitio.get('nombre'),
		tableName: 'Sitio'
	};
}