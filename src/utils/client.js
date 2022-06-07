import Parse from 'parse';
import { formatReservationData } from './formatData';

const RESERVACION_MODEL = Parse.Object.extend('Reservacion');
const RESERVACION_GOLF_MODEL = Parse.Object.extend('ReservacionGolf');
const AREA_MODEL = Parse.Object.extend("Area");
const SITIO_MODEL = Parse.Object.extend("Sitio");
const USER_MODEL = Parse.Object.extend("_User");
const COACH_MODEL = Parse.Object.extend("Profesor");
const RESERVACION_INVITADO_MODEL = Parse.Object.extend('ReservacionInvitado');
const INVITADO_MODEL = Parse.Object.extend("Invitado");
const MULTIPLE_RESERVATION_MODEL = Parse.Object.extend("ReservacionMultiple");
const REGLAMENTO_MODEL = Parse.Object.extend("Reglamento");

// Golf module
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

	const results = await guestReservation.find()
	results.forEach(guest => {
		guestsIds.push(guest.get("invitado").id);
	})
	Parse.Object.destroyAll(results);
	
	for(let id of guestsIds) {
		let guestQuery = new Parse.Query(INVITADO_MODEL);
		guestQuery.equalTo('objectId', id);
		guestQuery.find().then(results => {
			Parse.Object.destroyAll(results);
		})
	}
}

async function updateUsersEntry(reservationId) {

	// borrar todos los registros de ReservacionMultiple de una Reservacion
	const reservationQuery = new Parse.Query(RESERVACION_MODEL);
	reservationQuery.equalTo('objectId', reservationId);
	
	const multipleReservationsQuery = new Parse.Query(MULTIPLE_RESERVATION_MODEL);
	multipleReservationsQuery.matchesQuery('reservacion', reservationQuery);
	multipleReservationsQuery.include('user');
	const response = await multipleReservationsQuery.find();
	await Parse.Object.destroyAll(response);
	
}

/**
 * Saves reservation data in DB
 * @param {array} dataReservation 
 * @param {array} dataReservationGolf 
 * @param {array} guests 
 * @returns true if reservation data saved succesfully
 * else @returns false
 */
export async function createGolfReservation(dataReservation) {
	console.log("sitio ", dataReservation.sitio.objectId);
	// Hacer query de Sitio
	const sitioQuery = new Parse.Query(SITIO_MODEL);
	const sitioObject = await sitioQuery.get(dataReservation.sitio.objectId);

	// Update Reservation entry
	const reservationObj = new RESERVACION_MODEL();
	reservationObj.set('fechaInicio', dataReservation.fechaInicio);
	reservationObj.set('sitio', sitioObject);
	reservationObj.set('maximoJugadores', dataReservation.maximoJugadores);
	reservationObj.set('estatus', dataReservation.estatus);
	// Hacer query de Profesor
	if (dataReservation.profesor.objectId) {
		const profesorQuery = new Parse.Query(COACH_MODEL);
		const profesorObj = await profesorQuery.get(dataReservation.profesor.objectId);
		reservationObj.set('profesor', profesorObj);
	}
	const reservation = await reservationObj.save();

	// También queremos crear un  nuevo registro en ReservacionGolf
	const reservationGolfObj = new RESERVACION_GOLF_MODEL();
	reservationGolfObj.set('reservacion', reservation);
	reservationGolfObj.set('carritosReservados', 0);
	reservationGolfObj.set('cantidadHoyos', 9);
	const reservationGolf = await reservationGolfObj.save();
	return reservation;
}

// Gym module

export async function getReservationsGym() {
	try {
		// Query all sitios belonging to Golf
		const areaQuery = new Parse.Query(AREA_MODEL);
		areaQuery.equalTo('eliminado', false);
		areaQuery.equalTo('nombre', 'Gimnasio');

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

// Raqueta module

export async function getReservationsRaqueta() {
	try {
		// Query all sitios belonging to Rqueta
		const areaQuery = new Parse.Query(AREA_MODEL);
		areaQuery.equalTo('eliminado', false);
		areaQuery.equalTo('nombre', 'Raqueta');

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

// Pool module

export async function getReservationsPool() {
	try {
		// Query all sitios belonging to Rqueta
		const areaQuery = new Parse.Query(AREA_MODEL);
		areaQuery.equalTo('eliminado', false);
		areaQuery.equalTo('nombre', 'Alberca');

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

export async function getMultipleReservations(reservationId) {
	try {
		const reservationQuery = new Parse.Query(RESERVACION_MODEL);
		reservationQuery.equalTo('objectId', reservationId);

		const multipleReservationsQuery = new Parse.Query(MULTIPLE_RESERVATION_MODEL);
		multipleReservationsQuery.matchesQuery('reservacion', reservationQuery);
		multipleReservationsQuery.include('user');
		let data = await multipleReservationsQuery.find();
		return data;
	} catch (error) {
		console.log(`Ha ocurrido un error: ${ error }`);
		return null;
	}
}

// General API calls

/**
 * Retrieves all available module reservations from db
 * @param {string} module 
 * @returns {array} data
 */
export async function getAllAvailableReservations(module) {
	let data = [];
	let rawData = [];
	switch (module) {

		case 'golf':
			rawData = await getAllGolfAppointmentSlots();
			await Promise.all(rawData.map(async (reservation) => {
				const multipleReservationsData = await getMultipleReservations(reservation.id);
				const golfReservationData = await getReservationGolf(reservation.id);
				data.push(formatReservationData(reservation, golfReservationData, multipleReservationsData));
			}));
			break;
		
		case 'gym':
			rawData = await getReservationsGym();
			await Promise.all(rawData.map(async (reservation) => {
				const gymReservationData = await getMultipleReservations(reservation.id);
				data.push(formatReservationData(reservation, null, gymReservationData));
				}));

			break;

		case 'raqueta':
			rawData = await getReservationsRaqueta();
			await Promise.all(rawData.map(async (reservation) => data.push(formatReservationData(reservation))));
			break;

		case 'pool':
			rawData = await getReservationsPool();
			await Promise.all(rawData.map(async (reservation) => {
				const poolReservationData = await getMultipleReservations(reservation.id);
				data.push(formatReservationData(reservation, null, poolReservationData));
				}));

			break;
		
	}
		return data;
	

}

export async function updateReservation(dataReservation, guests, users) {
	const dataReservationCopy = JSON.parse(JSON.stringify(dataReservation));
	console.log('client: update', JSON.parse(JSON.stringify(dataReservation)));
	//try {
		// Create GolfReservation entry
		if (dataReservation.golfAppointment){
			const reservationQuery = new Parse.Query(RESERVACION_MODEL);
			const reservation = await reservationQuery.get(dataReservation.objectId);
			const golfData = dataReservation.golfAppointment;
			const reservationGolfObj = new Parse.Object('ReservacionGolf');
			reservationGolfObj.set('objectId', golfData.objectId);
			reservationGolfObj.set('carritosReservados', golfData.carritosReservados);
			reservationGolfObj.set('cantidadHoyos', golfData.cantidadHoyos);
			reservationGolfObj.set('reservacion', reservation);
			const response = await reservationGolfObj.save();
			// We remove the key so we don't sync it after
			delete dataReservation.golfAppointment;
		}

		// Update Reservation entry
		let reservationObj = new Parse.Object('Reservacion');
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
		await reservationObj.save();

		// Delete guests and multiple reservations
		await updateGuestsEntry(dataReservationCopy.objectId);
		await updateUsersEntry(dataReservationCopy.objectId);

		// Create guests entry
		for(let i = 0; i < guests.length; i++){
			let guestObj = new Parse.Object('Invitado');
			let reservationGuest = new Parse.Object('ReservacionInvitado');
			guestObj.set('nombre', guests[i].username);
			guestObj.set('user', dataReservation.user);

			if (guests[i].id !== "") {
				const user = new Parse.Object('_User');
				user.id = guests[i].id;
				reservationGuest.set('user', dataReservation.user);
			}

			reservationGuest.set('reservacion', reservationObj);
			reservationGuest.set('invitado', guestObj);

			guestObj.save();
			reservationGuest.save();
		}

		// Create multipleReservations
		if (dataReservationCopy.sitio.variasReservaciones)
			for(let i = 0; i < users.length; i++){
				const multipleReservationObj = new MULTIPLE_RESERVATION_MODEL();
				const userObj = new USER_MODEL();
				userObj.id = users[i].id;
				multipleReservationObj.set('user', userObj);
				multipleReservationObj.set('reservacion', reservationObj);
				multipleReservationObj.save();
			}

		return true;
	//}catch (error) {
	//	console.log(`Ha ocurrido un error ${ error }`);
	//	return false;
	//}
}

export async function getAreaByName(name) {
	const areaQuery = new Parse.Query(AREA_MODEL);
	areaQuery.equalTo('nombre', name);
	const response = await areaQuery.find();
	return response[0];
}

export async function getSitiosByArea(areaId) {
	//console.log(areaId);
	const areaQuery = new Parse.Query(AREA_MODEL);
	const areaObj = await areaQuery.get(areaId);
	const sitioQuery = new Parse.Query(SITIO_MODEL);
	sitioQuery.equalTo('area', areaObj);
	return await sitioQuery.find();
}

export async function deleteReservation(dataReservation) {
	//console.log('delete request', dataReservation);
	if (dataReservation.golfAppointment) {
		const golfReservationObj = new RESERVACION_GOLF_MODEL();
		golfReservationObj.set('objectId', dataReservation.golfAppointment.objectId);
		golfReservationObj.destroy();
	}
	const reservationObj = new RESERVACION_MODEL();
	reservationObj.set('objectId', dataReservation.objectId);
	await reservationObj.destroy();

	// Delete guests and multiple reservations
	updateGuestsEntry(dataReservation.objectId);
	updateUsersEntry(dataReservation.objectId);
}

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

export async function getAllMultipleReservations(id){
	//Get reservation
	const reservationQuery = new Parse.Query(RESERVACION_MODEL);
	reservationQuery.equalTo('objectId', id);

	const multipleReservation = new Parse.Query(MULTIPLE_RESERVATION_MODEL);
	multipleReservation.matchesQuery('reservacion', reservationQuery);
	multipleReservation.include('user');

	let data = await multipleReservation.find();
	return data;
}

export async function parseLogout(){
  Parse.User.logOut();
  return;
}

export async function checkUser() {
  const currentUser = await Parse.User.currentAsync();
  if (!currentUser) {
    return("NO_USER");
  }
  else if (!currentUser.attributes.isAdmin) {
    return("NOT_ADMIN");
  }
  try{
    const permissionsJson = await getPermissions(currentUser.attributes.AdminPermissions.id);
    return(permissionsJson);
  }
  catch(e){
    return("INVALID_SESSION");
  }

}

export async function getAnuncios() {
  const query = new Parse.Query("Anuncio");
  // query donde no esten eliminados
  const anuncios = await query.find();

  const result = new Array();
  for (var i = 0; i < anuncios.length; i++) {
    const fecha = new Date(anuncios[i].get("updatedAt").toString());
    result.push(
      new Array(
        anuncios[i].get("titulo"),
        anuncios[i].get("contenido"),
        anuncios[i].get("imagen").url(),
        fecha.getDate() + "/" + (fecha.getMonth() +1) + "/" + fecha.getFullYear(),
        anuncios[i].id
      )
    );
  }

  return result;
}

export async function createMember(email, pass, membershipNumber){
  
  const parseCuenta = Parse.Object.extend("Cuenta");
  const query = new Parse.Query("Cuenta");
  query.equalTo("noAccion", membershipNumber);
  // query donde no esten eliminados
  const result = await query.find();
  let accountId = '';
  //Si no existe el numero de socio, lo crea
  if (result.length === 0){
    const newAccount = new parseCuenta();
    newAccount.set('noAccion', membershipNumber);
    newAccount.set('pases', 0);
    await newAccount.save();
    accountId = newAccount.get("objectId");
  }
  //Si ya existe, obtiene el id 
  else {
    accountId = result[0].get("objectId");
  }

  const newUser = new Parse.User();
  newUser.set('username', email);
  newUser.set('email', email);
  newUser.set('password', pass);
  newUser.set('account', accountId);
  try{
    await newUser.save();
  }
  catch(e){
    console.log("Error en createMember: ", e);
    return(e);
  }
  return("ok");
}

export async function getPermissions(idRol) {
    const query = new Parse.Query('RolePermissions');
    query.equalTo('objectId', idRol);
    const permisosQuery = await query.find();
   
    const permissionsJson = {"Golf" : permisosQuery[0].get("Golf"), 
      "Raqueta": permisosQuery[0].get("Raqueta"),
      "Salones_gym": permisosQuery[0].get("Salones_gym"),
      "Anuncios": permisosQuery[0].get("Anuncios"),
      "Gestion": permisosQuery[0].get("Gestion"),
      "Alberca": permisosQuery[0].get("Alberca")}
    
    return permissionsJson;
  }

/**
 * Retrieves all regulations from db
 * @param {string} module 
 * @returns {array} data
 */
export async function getRegulations(module) {
	const areaQuery = new Parse.Query(AREA_MODEL);
	areaQuery.equalTo('nombre', module);
	
	const regulationsQuery = new Parse.Query(REGLAMENTO_MODEL);
	regulationsQuery.matchesQuery('area', areaQuery);
	regulationsQuery.include('area');

	const data = await regulationsQuery.find();
	return data;
}

/**
 * Saves changes made to regulations in db
 * @param {array} regulationsData 
 */
export async function updateRegulations(regulationsData) {
	try{
		let areaObj = new Parse.Object('Area');
		areaObj.set('objectId', regulationsData.areaId);
		console.log("data",regulationsData.objectId)
		let regulationsQuery = new Parse.Query(REGLAMENTO_MODEL);
		const regulationsObj = await regulationsQuery.get(regulationsData.objectId);
		
		regulationsObj.set('titulo', regulationsData.titulo);
		regulationsObj.set('contenido', regulationsData.contenido);
		regulationsObj.set('area', areaObj);

		regulationsObj.save();
		return true;
	}catch(error) {
		console.log(error);
		return false;
	}
}