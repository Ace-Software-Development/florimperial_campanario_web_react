import Parse from 'parse';

const RESERVACION_MODEL = Parse.Object.extend('Reservacion');
const RESERVACION_GOLF_MODEL = Parse.Object.extend('ReservacionGolf');
const AREA_MODEL = Parse.Object.extend("Area");
const SITIO_MODEL = Parse.Object.extend("Sitio");
const USER_MODEL = Parse.Object.extend("_User");
const COACH_MODEL = Parse.Object.extend("Profesor");
const RESERVACION_INVITADO_MODEL = Parse.Object.extend('ReservacionInvitado');

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

async function updateGuestsEntry(guests, reservationId) {
	// borrar todos los registros de reservacionInvitado e Invitado de una Reservacion
	const reservationQuery = new Parse.Query(RESERVACION_MODEL);
	reservationQuery.equalTo('objectId', reservationId);
	
	const guestReservation = new Parse.Query(RESERVACION_INVITADO_MODEL);
	guestReservation.matchesQuery('reservacion', reservationQuery);
	// guestReservation.include('invitado');
	guestReservation.find().then(function(results) {
		return Parse.Object.destroyAll(results);
	}).then(function() {
		// Items deleted succesfully
		console.log("exito");
	}, function(error) {
		// Error
	});
}

export async function updateGolfReservation(dataReservation, dataReservationGolf, guests) {
	//try {
		// Get reservation user
		//const userObj = new Parse.Query(USER_MODEL);
		//userObj.equalTo("objectId", dataReservation.userId);

		// In case it's a golf reservation
		delete dataReservation.ReservacionGolf;

		// Update Reservation entry
		let reservationObj = new Parse.Object('Reservacion');
		console.log(JSON.parse(JSON.stringify(dataReservation)));
		for (const key in dataReservation) {
			if (!dataReservation[key])
				continue

			if (dataReservation[key] instanceof Object && dataReservation[key].objectId) {
				console.log(key, dataReservation[key].tableName,  dataReservation[key].objectId);
				const query = new Parse.Query(dataReservation[key].tableName);
				const result = await query.get(dataReservation[key].objectId);
				dataReservation[key] = result;
			}
			reservationObj.set(key, dataReservation[key]);
		}
		const reservation = await reservationObj.save();
		console.log('new Reservation', reservation);
		//// Create GolfReservation entry
		//let reservationGolfObj = new Parse.Object('ReservacionGolf');
		//reservationGolfObj.set('carritosReservados', dataReservationGolf.carritosReservados);
		//reservationGolfObj.set('cantidadHoyos', dataReservationGolf.cantidadHoyos);
		//reservationGolfObj.set('reservacion', reservationObj);
		//await reservationGolfObj.save();

		//// Create guests entry
		//for(let i = 0; i < guests.length; i++){
		//	let guestObj = new Parse.Object('Invitado');
		//	let reservationGuest = new Parse.Object('ReservacionInvitado');
		//	guestObj.set('nombre', guests[i].username);
		//	//guestObj.set('user', userObj);

		//	if (guests[i].id != "") {
		//		const user = new Parse.Object('_User');
		//		user.id = guests[i].id;
		//		reservationGuest.set('user', user);
		//	}

		//	reservationGuest.set('reservacion', reservationObj);
		//	reservationGuest.set('invitado', guestObj);

		//	guestObj.save();
		//	reservationGuest.save();
		//}

	//}catch(error) {
	//	console.log(error);
	//}
}

// General API calls

/**
 * Retrieves all active users from DB
 * @returns {array} data
 */
export async function getAllActiveUsers(){
	// Get current user loged in
	const userObj = await Parse.User.currentAsync();

	// Query all Users
	const userQuery = new Parse.Query(USER_MODEL);
	userQuery.equalTo('isAdmin', false);
	userQuery.equalTo('active', true);
	userQuery.notEqualTo('objectId', userObj.id);
	userQuery.descending('username');

	let data = await userQuery.find();
	return data;
}

export async function getAllCoaches(){
	// Query all Coaches
	const userQuery = new Parse.Query(COACH_MODEL);
	let data = await userQuery.find();
	return data;
}
/**
 * Retrieves all guests from a specific reservation
 */
export async function getAllReservationGuests(id){
	//Get reservation
	const reservationQuery = new Parse.Query(RESERVACION_MODEL);
	reservationQuery.equalTo('objectId', id);

	const guestReservation = new Parse.Query(RESERVACION_INVITADO_MODEL);
	guestReservation.matchesQuery('reservacion', reservationQuery);
	guestReservation.include('invitado');

	let data = await guestReservation.find();
	return data;
}
