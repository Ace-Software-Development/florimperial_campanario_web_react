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

	const results = await guestReservation.find()
	results.forEach(guest => {
		guestsIds.push(guest.get("invitado").id);
	})
	Parse.Object.destroyAll(results);
	
	for(let id of guestsIds) {
		let guestQuery = new Parse.Query(INVITADO_MODEL);
		guestQuery.equalTo('objectId', id);
		guestQuery.find().then(results => {
			console.log("resultados -> ", results)
			Parse.Object.destroyAll(results);
		})
	}
}

export async function updateGolfReservation(dataReservation, guests) {
	try {
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

		return true;
	}catch (error) {
		console.log(`Ha ocurrido un error ${ error }`);
		return false;
	}
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
	const result = await reservationObj.save();
	return result;
}

// General API calls


export async function getAllAvailableReservations(module) {
	let data = [];
	switch (module) {
		case 'golf':
			data = getAllGolfAppointmentSlots();
			break;

	}

	return data;
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

export async function parseLogout(){
  Parse.User.logOut();
  return;
}

export async function checkUser() {
  const currentUser = await Parse.User.currentAsync();
  if (!currentUser) {
    return("NO_USER");
  }
  else if (currentUser.attributes.isAdmin == false) {
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
    console.log(anuncios[i].get("titulo"));
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
    console.log("obteniendo permisos...");
    const permisosQuery = await query.find();
    console.log(permisosQuery);
   
    const permissionsJson = {"Golf" : permisosQuery[0].get("Golf"), 
      "Raqueta": permisosQuery[0].get("Raqueta"),
      "Salones_gym": permisosQuery[0].get("Salones_gym"),
      "Anuncios": permisosQuery[0].get("Anuncios"),
      "Gestion": permisosQuery[0].get("Gestion"),
      "Alberca": permisosQuery[0].get("Alberca")}
    
    return permissionsJson;
  }


