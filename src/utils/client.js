import Parse from 'parse';

const RESERVACION_MODEL = Parse.Object.extend('Reservacion');
const RESERVACION_GOLF_MODEL = Parse.Object.extend('ReservacionGolf');
const AREA_MODEL = Parse.Object.extend("Area");
const SITIO_MODEL = Parse.Object.extend("Sitio");
const USER_MODEL = Parse.Object.extend("_User");

export async function getAllGolfAppointmentSlots(){
	try {
		// Query all sitios belonging to Golf
		const areaQuery = new Parse.Query(AREA_MODEL);
		areaQuery.equalTo('eliminado', false);
		areaQuery.equalTo('nombre', 'Golf');

		const sitiosQuery = new Parse.Query(SITIO_MODEL);
		sitiosQuery.select("nombre");
		sitiosQuery.equalTo('eliminado', false);
		sitiosQuery.matchesQuery('area', areaQuery);
		sitiosQuery.include('area');

		// Query all reservations
		const reservationQuery = new Parse.Query(RESERVACION_MODEL);
		reservationQuery.equalTo('eliminado', false);
		reservationQuery.matchesQuery('sitio', sitiosQuery);
		reservationQuery.include('sitio');
		reservationQuery.include('profesor');
		reservationQuery.include('user');
		let data = await reservationQuery.find();
		return data;
		
	} catch (error) {
		console.log(`Ha ocurrido un error: ${ error }`);
		return null;
	}
}

export async function getReservationGolf(appointmentId) {
	try {
		const reservationQuery = new Parse.Query(RESERVACION_MODEL);
		reservationQuery.equalTo('objectId', appointmentId);

		const golfReservationQuery = new Parse.Query(RESERVACION_GOLF_MODEL);            
		golfReservationQuery.matchesQuery('reservacion', reservationQuery);

		let results = await golfReservationQuery.find();
		return results.length ? results[0] : null;
	} catch (error) {
		console.log(`Ha ocurrido un error ${ error }`);
	}
}
