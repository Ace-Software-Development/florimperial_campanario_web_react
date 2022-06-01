import Parse from 'parse';

const RESERVACION_MODEL = Parse.Object.extend('Reservacion');
const RESERVACION_GOLF_MODEL = Parse.Object.extend('ReservacionGolf');
const AREA_MODEL = Parse.Object.extend("Area");
const SITIO_MODEL = Parse.Object.extend("Sitio");
const USER_MODEL = Parse.Object.extend("_User");
const COACH_MODEL = Parse.Object.extend("Profesor");
const RESERVACION_INVITADO_MODEL = Parse.Object.extend('ReservacionInvitado');
const INVITADO_MODEL = Parse.Object.extend("Invitado");

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

async function updateGuestsEntry(reservationId) {
	const guestsIds = [];

	// borrar todos los registros de reservacionInvitado e Invitado de una Reservacion
	const reservationQuery = new Parse.Query(RESERVACION_MODEL);
	reservationQuery.equalTo('objectId', reservationId);
	
	const guestReservation = new Parse.Query(RESERVACION_INVITADO_MODEL);
	guestReservation.matchesQuery('reservacion', reservationQuery);
	guestReservation.include('invitado');

	guestReservation.find().then(results => {
		results.forEach(guest => {
			guestsIds.push(guest.get("invitado").id);
		})
		Parse.Object.destroyAll(results);
	})

	for(let id of guestsIds) {
		let guestQuery = new Parse.Query(INVITADO_MODEL);
		guestQuery.equalTo('objectId', id);
		guestQuery.find().then(results => {
			Parse.Object.destroyAll(results);
		})
	}
}

export async function updateGolfReservation(dataReservation, guests) {
	// Create GolfReservation entry
	if (dataReservation.reservacionGolf){
		const reservationQuery = new Parse.Query(RESERVACION_MODEL);
		const reservation = await reservationQuery.get(dataReservation.objectId);
	
		console.log(reservation);
		const golfData = dataReservation.reservacionGolf;
		const reservationGolfObj = new Parse.Object('ReservacionGolf');
		reservationGolfObj.set('carritosReservados', golfData.carritosReservados);
		//reservationGolfObj.set('cantidadHoyos', dataReservationGolf.cantidadHoyos);
		reservationGolfObj.set('reservacion', reservation);
		await reservationGolfObj.save();

		// We remove the key so we don't sync it after
		delete dataReservation.reservacionGolf;
	}

	// Update Reservation entry
	let reservationObj = new Parse.Object('Reservacion');
	console.log(JSON.parse(JSON.stringify(dataReservation)));
	for (const key in dataReservation) {
		if (!dataReservation[key])
			continue

		if (dataReservation[key] instanceof Object && dataReservation[key].objectId) {
			const query = new Parse.Query(dataReservation[key].tableName);
			const result = await query.get(dataReservation[key].objectId);
			dataReservation[key] = result;
		}
		reservationObj.set(key, dataReservation[key]);
	}
	const reservation = await reservationObj.save();
	console.log('new Reservation', reservation);

	// Delete guests
	updateGuestsEntry(dataReservation.objectId);

	// Create guests entry
	for(let i = 0; i < guests.length; i++){
		let guestObj = new Parse.Object('Invitado');
		let reservationGuest = new Parse.Object('ReservacionInvitado');
		guestObj.set('nombre', guests[i].username);
		guestObj.set('user', dataReservation.user);

		if (guests[i].id != "") {
			const user = new Parse.Object('_User');
			user.id = guests[i].id;
			reservationGuest.set('user', dataReservation.user);
		}

		reservationGuest.set('reservacion', reservationObj);
		reservationGuest.set('invitado', guestObj);

		guestObj.save();
		reservationGuest.save();
	}
}

export async function createGolfReservation(dataReservation) {
	/**
	 * Saves reservation data in DB
	 * @param {array} dataReservation 
	 * @param {array} dataReservationGolf 
	 * @param {array} guests 
	 * @returns true if reservation data saved succesfully
	 * else @returns false
	 */
	// Hacer query de Sitio
	const sitioQuery = new Parse.Query(SITIO_MODEL);
	const sitioObject = await sitioQuery.get(dataReservation);
	
	// Hacer query de Profesor
	const profesorQuery = new Parse.Query(COACH_MODEL);
	const profesorObj = await profesorQuery.get(dataReservation);

	// Update Reservation entry
	let reservationObj = new Parse.Object(RESERVACION_MODEL);
	reservationObj.set('fechaInicio', dataReservation.fechaInicio);
	reservationObj.set('sitio', sitioObject);
	reservationObj.set('maximoJugadores', dataReservation.maximoJugadores);
	reservationObj.set('estatus', dataReservation.estatus);
	reservationObj.set('profesor', profesorObj);
	await reservationObj.save();

	return true;
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
 * @param {string} id
 * @returns {array} data
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
