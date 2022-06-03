export function formatReservationData(reservation, golfReservation=null, multipleReservations=null){
	const formatedData = {
		objectId: reservation.id,
		id: reservation.id,
		title: reservation.get('user')===undefined || reservation.get('estatus') === 1 ? 'Disponible' : reservation.get('user').get('username'),
		start: reservation.get('fechaInicio'),
		estatus: reservation.get('estatus'),
		maximoJugadores: reservation.get('maximoJugadores'),
		sitio: {
			objectId: reservation.get('sitio').id,
			nombre: reservation.get('sitio').nombre,
			tableName: 'Sitio',
		},
		profesor: reservation.get('profesor') ? {
			objectId: reservation.get('profesor').id,
			nombre: reservation.get('profesor').get('nombre'),
			tableName: 'Profesor',
		} : null
	}

	if (reservation.user)
		formatedData['user'] = {
			objectId: reservation.get('user').id,
			username: reservation.get('user').get('username'),
			tableName: 'User'
		};
	
	if (golfReservation)
		formatedData['golfAppointment'] = {
			objectId: golfReservation.id,
			carritosReservados: golfReservation.get('carritosReservados'),
			cantidadHoyos: golfReservation.get('cantidadHoyos'),
			reservacion: {
				objectId: reservation.id
			},
		}
	return formatedData;
}