import Parse from 'parse';
import ParseObject from 'parse/lib/browser/ParseObject';
import ParseUser from 'parse/lib/browser/ParseUser';
import {formatReservationData} from './formatData';

const RESERVACION_MODEL = Parse.Object.extend('Reservacion');
const RESERVACION_GOLF_MODEL = Parse.Object.extend('ReservacionGolf');
const AREA_MODEL = Parse.Object.extend('Area');
const SITIO_MODEL = Parse.Object.extend('Sitio');
const USER_MODEL = Parse.Object.extend('_User');
const COACH_MODEL = Parse.Object.extend('Profesor');
const RESERVACION_INVITADO_MODEL = Parse.Object.extend('ReservacionInvitado');
const INVITADO_MODEL = Parse.Object.extend('Invitado');
const REGLAMENTO_MODEL = Parse.Object.extend('Reglamento');
const MULTIPLE_RESERVATION_MODEL = Parse.Object.extend('ReservacionMultiple');
const CLINICA_MODEL = Parse.Object.extend('Clinica');
const RESERVACION_CLINICA_MODEL = Parse.Object.extend('ReservacionClinica');

/**
 * Returns all the data of golf appoinntments
 * @returns {Array(ParseObject)}
 *
 */
export async function getAllGolfAppointmentSlots() {
  try {
    // Query all sitios belonging to Golf
    const areaQuery = new Parse.Query(AREA_MODEL);
    areaQuery.equalTo('eliminado', false);
    areaQuery.equalTo('nombre', 'Golf');

    const sitiosQuery = new Parse.Query(SITIO_MODEL);
    sitiosQuery.select('nombre');
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
    console.log(`Ha ocurrido un error: ${error}`);
    return null;
  }
}

/**
 * @description it returns the GolfReservation given an id of a reservation
 * @returns ParseObject
 */
export async function getReservationGolf(appointmentId) {
  try {
    const reservationQuery = new Parse.Query(RESERVACION_MODEL);
    reservationQuery.equalTo('objectId', appointmentId);

    const golfReservationQuery = new Parse.Query(RESERVACION_GOLF_MODEL);
    golfReservationQuery.matchesQuery('reservacion', reservationQuery);

    let results = await golfReservationQuery.find();
    return results.length ? results[0] : null;
  } catch (error) {
    console.log(`Ha ocurrido un error ${error}`);
  }
}
/**
 * Clears the guests of a reservations
 * @param {number} reservationId
 */
async function updateGuestsEntry(reservationId) {
  const guestsIds = [];
  // borrar todos los registros de reservacionInvitado e Invitado de una Reservacion
  const reservationQuery = new Parse.Query(RESERVACION_MODEL);
  reservationQuery.equalTo('objectId', reservationId);

  const guestReservation = new Parse.Query(RESERVACION_INVITADO_MODEL);
  guestReservation.matchesQuery('reservacion', reservationQuery);
  guestReservation.include('invitado');

  const results = await guestReservation.find();
  results.forEach(guest => {
    guestsIds.push(guest.get('invitado').id);
  });
  Parse.Object.destroyAll(results);

  for (let id of guestsIds) {
    let guestQuery = new Parse.Query(INVITADO_MODEL);
    guestQuery.equalTo('objectId', id);
    guestQuery.find().then(results => {
      Parse.Object.destroyAll(results);
    });
  }
}

/**
 * @description clears all multiple reservations given a reservation id
 * @param id of a reservation
 */
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
/**
 * @description queries for all reservations where Sitio belongs to a Gym area
 * @returns {Array(ParseObject)} An array of objects containing the relation table
 */
export async function getReservationsGym() {
  try {
    // Query all sitios belonging to Golf
    const areaQuery = new Parse.Query(AREA_MODEL);
    areaQuery.equalTo('eliminado', false);
    areaQuery.equalTo('nombre', 'Gimnasio');

    const sitiosQuery = new Parse.Query(SITIO_MODEL);
    sitiosQuery.select('nombre');
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
    console.log(`Ha ocurrido un error: ${error}`);
    return null;
  }
}

// Raqueta module
/**
 * @description queries for all reservations where Sitio belongs to a Raqueta area
 * @returns {Array(ParseObject)} An array of objects containing the relation table
 */
export async function getReservationsRaqueta() {
  try {
    // Query all sitios belonging to Rqueta
    const areaQuery = new Parse.Query(AREA_MODEL);
    areaQuery.equalTo('eliminado', false);
    areaQuery.equalTo('nombre', 'Raqueta');

    const sitiosQuery = new Parse.Query(SITIO_MODEL);
    sitiosQuery.select('nombre');
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
    console.log(`Ha ocurrido un error: ${error}`);
    return null;
  }
}

// Pool module
/**
 * @description queries for all reservations where Sitio belongs to a Alberca area
 * @returns {Array(ParseObject)} An array of objects containing the relation table
 */
export async function getReservationsPool() {
  try {
    // Query all sitios belonging to Rqueta
    const areaQuery = new Parse.Query(AREA_MODEL);
    areaQuery.equalTo('eliminado', false);
    areaQuery.equalTo('nombre', 'Alberca');

    const sitiosQuery = new Parse.Query(SITIO_MODEL);
    sitiosQuery.select('nombre');
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
    console.log(`Ha ocurrido un error: ${error}`);
    return null;
  }
}

/**
 * @description queries for all reservations belonging a reservation
 * @returns {Array(ParseObject)} An array of objects containing the relation table
 */
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
    console.log(`Ha ocurrido un error: ${error}`);
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
      await Promise.all(
        rawData.map(async reservation => {
          const multipleReservationsData = await getMultipleReservations(reservation.id);
          const golfReservationData = await getReservationGolf(reservation.id);
          data.push(
            formatReservationData(reservation, golfReservationData, multipleReservationsData)
          );
        })
      );
      break;

    case 'gym':
      rawData = await getReservationsGym();
      await Promise.all(
        rawData.map(async reservation => {
          const gymReservationData = await getMultipleReservations(reservation.id);
          data.push(formatReservationData(reservation, null, gymReservationData));
        })
      );

      break;

    case 'raqueta':
      rawData = await getReservationsRaqueta();
      await Promise.all(
        rawData.map(async reservation => data.push(formatReservationData(reservation)))
      );
      break;

    case 'pool':
      rawData = await getReservationsPool();
      await Promise.all(
        rawData.map(async reservation => {
          const poolReservationData = await getMultipleReservations(reservation.id);
          data.push(formatReservationData(reservation, null, poolReservationData));
        })
      );

      break;
  }
  return data;
}

/**
 * @description updates a reservation
 * @params formated data of a reservation, array of guests objects, array of user objects
 */
export async function updateReservation(dataReservation, guests, users) {
  const dataReservationCopy = JSON.parse(JSON.stringify(dataReservation));
  try {
    // Create GolfReservation entry
    if (dataReservation.golfAppointment) {
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
    for (let i = 0; i < guests.length; i++) {
      let guestObj = new Parse.Object('Invitado');
      let reservationGuest = new Parse.Object('ReservacionInvitado');
      guestObj.set('nombre', guests[i].username);
      guestObj.set('user', dataReservation.user);

      if (guests[i].id !== '') {
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
      for (let i = 0; i < users.length; i++) {
        const multipleReservationObj = new MULTIPLE_RESERVATION_MODEL();
        const userObj = new USER_MODEL();
        userObj.id = users[i].id;
        multipleReservationObj.set('user', userObj);
        multipleReservationObj.set('reservacion', reservationObj);
        multipleReservationObj.save();
      }

    return true;
  } catch (error) {
    console.log(`Ha ocurrido un error ${error}`);
    return false;
  }
}

/**
 * @description return an Area query given a name
 * @returns {ParseObject} An object containing the relation table
 */
export async function getAreaByName(name) {
  const areaQuery = new Parse.Query(AREA_MODEL);
  areaQuery.equalTo('nombre', name);
  const response = await areaQuery.find();
  return response[0];
}

/**
 * @description queries for all sitios where given an area id
 * @returns {ParseObject} An object containing the relation table
 */
export async function getSitiosByArea(areaId) {
  const areaQuery = new Parse.Query(AREA_MODEL);
  const areaObj = await areaQuery.get(areaId);
  const sitioQuery = new Parse.Query(SITIO_MODEL);
  sitioQuery.equalTo('area', areaObj);
  return await sitioQuery.find();
}

/**
 * @description deletes all reservation related data
 * @params formated data of a reservation
 */
export async function deleteReservation(dataReservation) {
  // Delete guests and multiple reservations
  await updateGuestsEntry(dataReservation.objectId);
  await updateUsersEntry(dataReservation.objectId);

  if (dataReservation.golfAppointment) {
    const golfReservationObj = new RESERVACION_GOLF_MODEL();
    golfReservationObj.set('objectId', dataReservation.golfAppointment.objectId);
    golfReservationObj.destroy().then(result => {
      console.log('GolfReservation  has been deleted', result);
    });
  }
  const reservationObj = new RESERVACION_MODEL();
  reservationObj.set('objectId', dataReservation.objectId);
  await reservationObj.destroy();
}

/**
 * Retrieves all active users from DB
 * @returns {array} data
 */
export async function getAllActiveUsers() {
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

/**
 * @description queries for all profesores
 * @returns {Array(ParseObject)} An array of objects containing the relation table
 */
export async function getAllCoaches() {
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
export async function getAllReservationGuests(id) {
  //Get reservation
  const reservationQuery = new Parse.Query(RESERVACION_MODEL);
  reservationQuery.equalTo('objectId', id);

  const guestReservation = new Parse.Query(RESERVACION_INVITADO_MODEL);
  guestReservation.matchesQuery('reservacion', reservationQuery);
  guestReservation.include('invitado');

  let data = await guestReservation.find();
  return data;
}

export async function getAllMultipleReservations(id) {
  //Get reservation
  const reservationQuery = new Parse.Query(RESERVACION_MODEL);
  reservationQuery.equalTo('objectId', id);

  const multipleReservation = new Parse.Query(MULTIPLE_RESERVATION_MODEL);
  multipleReservation.matchesQuery('reservacion', reservationQuery);
  multipleReservation.include('user');

  let data = await multipleReservation.find();
  return data;
}

/**
 * parseLogout
 * @description It logs out the current parse user
 */
export async function parseLogout() {
  Parse.User.logOut();
  return;
}

/**
 * getAdminRoleId
 * @description it obtains from db the role ID of the received admin user
 * @param {number} idUsuario: the _User objectId
 * @returns {number} the objectId of admin's role
 */
export async function getAdminRoleId(idUsuario) {
  const query = new Parse.Query('AdminRol');
  let userPointer = {
    __type: 'Pointer',
    className: '_User',
    objectId: idUsuario,
  };
  query.equalTo('Admin', userPointer);
  const rolQuery = await query.find();
  return rolQuery[0].attributes.rol.id;
}

/**
 * getSupportNumbers
 * @description it obtains from db the different phone numbers registered
 * @returns {Array(ParseObject)} an array of NumeroAtencion Objects
 */
export async function getSupportNumbers() {
  const query = new Parse.Query('NumeroAtencion');
  const result = await query.find();
  return result;
}
/**
 * getAdminRole
 * @description it obtains from db the role of the received admin user
 * @param {number} idUsuario: the _User objectId
 * @returns {ParseObject} the complete object of admin's role
 */
export async function getAdminRole(idUsuario) {
  const query = new Parse.Query('AdminRol');
  let userPointer = {
    __type: 'Pointer',
    className: '_User',
    objectId: idUsuario,
  };
  query.equalTo('Admin', userPointer);
  const rolQuery = await query.find();
  return rolQuery[0];
}

/**
 * checkUser
 * @description it checks the current user and its permissions.
 * @returns {json|string} the permissions of the user in a json format | the error message.
 */
export async function checkUser() {
  const currentUser = await Parse.User.currentAsync();
  if (!currentUser) {
    return 'NO_USER';
  } else if (!currentUser.attributes.isAdmin) {
    return 'NOT_ADMIN';
  }
  try {
    let adminRoleId = await getAdminRoleId(currentUser.id);
    const permissionsJson = await getPermissions(adminRoleId);
    return permissionsJson;
  } catch (e) {
    return 'INVALID_SESSION';
  }
}

/**
 * getAnuncios
 * @description it gathers all the announcements and puts them in an matrix
 * @returns {Array(Array)} a matrix containing each announcement and its properties pre-processed.
 */
export async function getAnuncios() {
  const query = new Parse.Query('Anuncio');
  // query donde no esten eliminados
  const anuncios = await query.find();

  const result = new Array();
  for (var i = 0; i < anuncios.length; i++) {
    const fecha = new Date(anuncios[i].get('updatedAt').toString());
    result.push(
      new Array(
        anuncios[i].get('titulo'),
        anuncios[i].get('contenido'),
        anuncios[i].get('imagen').url(),
        fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear(),
        anuncios[i].id
      )
    );
  }
  return result;
}

/**
 * getAdminUsers
 * @description it returns the relation table of all the admins and their roles
 * @returns {Array(ParseObject)} An array of objects containing the relation table
 */
export async function getAdminUsers() {
  const query = new Parse.Query('AdminRol');
  const result = await query.find();
  return result;
}

/**
 * createMember
 * @description it creates a member (socio) in the database
 * @param {string} email: the email to be registered
 * @param {string} pass: the temporary password for the new user
 * @param {string} membershipNumber. the membership number to be registered/updated in database
 * @returns {string} the status of the transaction.
 */
export async function createMember(email, pass, membershipNumber) {
  const parseCuenta = Parse.Object.extend('Cuenta');
  const query = new Parse.Query('Cuenta');
  query.equalTo('noAccion', membershipNumber);
  // query donde no esten eliminados
  const result = await query.find();
  let accountId = '';
  //Si no existe el numero de socio, lo crea
  if (result.length === 0) {
    const newAccount = new parseCuenta();
    newAccount.set('noAccion', membershipNumber);
    newAccount.set('pases', 0);
    await newAccount.save();
    accountId = newAccount.get('objectId');
  }
  //Si ya existe, obtiene el id
  else {
    accountId = result[0].get('objectId');
  }

  const newUser = new Parse.User();
  newUser.set('username', email);
  newUser.set('email', email);
  newUser.set('password', pass);
  newUser.set('account', accountId);
  try {
    await newUser.save();
  } catch (e) {
    console.log('Error en createMember: ', e);
    return e;
  }
  return 'ok';
}

/**
 * getPermissions
 * @description it gets the permissions of the current admin
 * @param {number} idRol: the _User Role id
 * @returns {json} the permissions of the admin in a json format
 */
export async function getPermissions(idRol) {
  const query = new Parse.Query('RolePermissions');
  query.equalTo('objectId', idRol);
  const permisosQuery = await query.find();

  const permissionsJson = {
    Golf: permisosQuery[0].get('Golf'),
    Raqueta: permisosQuery[0].get('Raqueta'),
    Salones_gym: permisosQuery[0].get('Salones_gym'),
    Anuncios: permisosQuery[0].get('Anuncios'),
    Gestion: permisosQuery[0].get('Gestion'),
    Alberca: permisosQuery[0].get('Alberca'),
  };
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
  try {
    let areaObj = new Parse.Object('Area');
    areaObj.set('objectId', regulationsData.areaId);
    console.log('data', regulationsData.objectId);
    let regulationsQuery = new Parse.Query(REGLAMENTO_MODEL);
    const regulationsObj = await regulationsQuery.get(regulationsData.objectId);

    regulationsObj.set('titulo', regulationsData.titulo);
    regulationsObj.set('contenido', regulationsData.contenido);
    regulationsObj.set('area', areaObj);

    regulationsObj.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * getRoleNames
 * @description it obtains from db the role of the received admin user
 * @param {number} idUsuario: the _User objectId
 * @returns {ParseObject:AdminRol} the object with the roleId, the username and the UserId
 */
export async function getRolesNames() {
  const query = new Parse.Query('RolePermissions');
  const permisosQuery = await query.find();
  return permisosQuery;
}

/**
 * setAdminRole
 * @description it updates the role of the selected admin
 * @param {number} idAdmin: the _User objectId
 * @param {number} idRol: the role objectId
 */
export async function setAdminRole(idAdmin, idRol) {
  const query = new Parse.Query('AdminRol');
  let userPointer = {
    __type: 'Pointer',
    className: '_User',
    objectId: idAdmin,
  };
  query.equalTo('Admin', userPointer);
  const result = await query.find();
  const adminRolObj = result[0];
  let rolePointer = {
    __type: 'Pointer',
    className: 'RolePermissions',
    objectId: idRol,
  };
  await adminRolObj.set('rol', rolePointer);
  await adminRolObj.save();
}

/**
 * setSupportNumber
 * @description it sets a new support number
 * @param {number} idNumero: the Number objectId
 * @param {number} nuevoNum: the new value for attribute Numero
 */
export async function setSupportNumber(idNumero, nuevoNum) {
  console.log('idnum:', idNumero);
  const query = new Parse.Query('NumeroAtencion');
  query.equalTo('objectId', idNumero);
  const result = await query.find();
  const numeroEnDb = result[0];
  console.log(numeroEnDb);
  await numeroEnDb.set('Numero', nuevoNum);
  await numeroEnDb.save();
}

/**
 * getReservations()
 * @param none
 * @returns array with all reservations made by user
 * else @returns empty array
 */
export async function getReservations(userId) {
  const userObj = new ParseUser();
  userObj.set('objectId', userId);

  const areaQuery = new Parse.Query(AREA_MODEL);
  areaQuery.select('nombre');
  areaQuery.equalTo('eliminado', false);

  const sitiosQuery = new Parse.Query(SITIO_MODEL);
  sitiosQuery.select('nombre');
  sitiosQuery.equalTo('eliminado', false);
  sitiosQuery.matchesQuery('area', areaQuery);
  sitiosQuery.include('area');

  const reservationQuery = new Parse.Query(RESERVACION_MODEL);
  reservationQuery.equalTo('user', userObj);
  reservationQuery.equalTo('eliminado', false);
  reservationQuery.equalTo('estatus', 2);
  reservationQuery.include('sitio');

  let data = await reservationQuery.find();

  const multipleReservationIdQuery = new Parse.Query(MULTIPLE_RESERVATION_MODEL);
  multipleReservationIdQuery.select('reservacion');
  multipleReservationIdQuery.equalTo('user', userObj);

  let reservacionMultipeId = await multipleReservationIdQuery.find();
  const reservacionIDS = [];

  for (let i of reservacionMultipeId) {
    reservacionIDS.push(i.get('reservacion').id);
  }

  for (let i of reservacionIDS) {
    const multipleReservationQuery = new Parse.Query(RESERVACION_MODEL);
    multipleReservationQuery.equalTo('objectId', i);
    multipleReservationQuery.equalTo('eliminado', false);
    multipleReservationQuery.matchesQuery('sitio', sitiosQuery);
    multipleReservationQuery.include('sitio');

    let reservacion = await multipleReservationQuery.find();

    data.push(reservacion[0]);
  }

  data.sort(function(a, b) {
    return a.get('fechaInicio').toISOString() > b.get('fechaInicio').toISOString()
      ? -1
      : a.get('fechaInicio').toISOString() < b.get('fechaInicio').toISOString()
      ? 1
      : 0;
  });

  return data;
}

export async function getArea() {
  const areaQuery = new Parse.Query(AREA_MODEL);
  areaQuery.equalTo('eliminado', false);

  let data = await areaQuery.find();
  const areas = new Map();

  for (let i of data) {
    areas.set(i.id, i.get('nombre'));
  }
  return areas;
}

/**
 * Retrieves all clinics from a scecific site
 * @param {string} module 
 * @returns {array} data
 */
export async function getAllClinicsReservations(module) {
  const areaQuery = new Parse.Query(AREA_MODEL);
  areaQuery.equalTo('eliminado', false);
  areaQuery.equalTo('nombre', module);

  const sitiosQuery = new Parse.Query(SITIO_MODEL);
  sitiosQuery.select('nombre');
  sitiosQuery.equalTo('eliminado', false);
  sitiosQuery.matchesQuery('area', areaQuery);
  sitiosQuery.include('area');
  
  const clinicaQuery = new Parse.Query(CLINICA_MODEL);
  clinicaQuery.matchesQuery('sitio', sitiosQuery);
  clinicaQuery.include('sitio');

  const data = await clinicaQuery.find();
  return data;
}

/**
 * Retrieves all clinics from DB
 * @param {string} clinicId 
 * @returns {array} data
 */
export async function getReservacionClinica(clinicId) {
  const clinicaQuery = new Parse.Query(CLINICA_MODEL);
  clinicaQuery.equalTo('objectId', clinicId);
  
  const clinicReservation = new Parse.Query(RESERVACION_CLINICA_MODEL);
  clinicReservation.matchesQuery('clinica', clinicaQuery);
  clinicReservation.include('reservacion');
  clinicReservation.include('user');

  const data = await clinicReservation.find();
  return data;
}

/**
 * Creates new clinic in DB
 * @param {array} reservationData 
 * @param {array} users 
 */
export async function createReservationClinic(reservationData, users) {
  // Get sitio
  const sitioQuery = new Parse.Query(SITIO_MODEL);
  const sitioObject = await sitioQuery.get(reservationData.sitio.objectId);
  
  // Create new Clinic entry
  const clinicObj = new CLINICA_MODEL();
  clinicObj.set('nombre', reservationData.nombre);
  clinicObj.set('maximoJugadores', reservationData.maximoJugadores);
  clinicObj.set('horario', reservationData.horario);
  clinicObj.set('dias', reservationData.dias);
  clinicObj.set('fechaInicio', reservationData.fechaInicio);
  clinicObj.set('fechaFin', reservationData.fechaFin);
  clinicObj.set('sitio', sitioObject);

  const clinic = await clinicObj.save();

  // Create users entry
  users.forEach(async socioId => {
   // Get socio
   const socioQuery = new Parse.Query(USER_MODEL);
   const socioObj = await socioQuery.get(socioId);
    
   // Creata new ReservacionClinica entry
   const clinicReservationObj = new RESERVACION_CLINICA_MODEL();
   clinicReservationObj.set('user', socioObj);
   clinicReservationObj.set('clinica', clinic);
   await clinicReservationObj.save();
  })
}

/**
 * deletes ReservacionClinica in DB
 * @param {object} clinicObject 
 */
async function deleteClinicReservations(clinicObject) {
  const clinicReservationsQuery = new Parse.Query(RESERVACION_CLINICA_MODEL);
  clinicReservationsQuery.equalTo('clinica', clinicObject);
  const response = await clinicReservationsQuery.find();
  await Parse.Object.destroyAll(response);
}

/**
 * Updates clinic data
 * @param {array} reservationData 
 * @param {array} users 
 * @returns 
 */
export async function updateClinicsReservations(reservationData, users) {
  try {
    // Get sitio
    const sitioQuery = new Parse.Query(SITIO_MODEL);
    const sitioObject = await sitioQuery.get(reservationData.sitio.objectId);
    
    // Update clinic data
    const clinicQuery = new Parse.Query(CLINICA_MODEL);
    const clinicObject = await clinicQuery.get(reservationData.objectId);
    clinicObject.set('nombre', reservationData.nombre);
    clinicObject.set('fechaInicio', reservationData.fechaInicio);
    clinicObject.set('fechaFin', reservationData.fechaFin);
    clinicObject.set('horario', reservationData.horario);
    clinicObject.set('maximoJugadores', reservationData.maximoJugadores);
    clinicObject.set('sitio', sitioObject);
    clinicObject.set('dias', reservationData.dias);
    
    await clinicObject.save();

    // Delete al clinic reservations
    await deleteClinicReservations(clinicObject);

    // Create users entry
    for(let user of users){
      // Get socio
      const socioQuery = new Parse.Query(USER_MODEL);
      const socioObj = await socioQuery.get(user.id);
      
      // Creata new ReservacionClinica entry
      const clinicReservationObj = new RESERVACION_CLINICA_MODEL();
      clinicReservationObj.set('user', socioObj);
      clinicReservationObj.set('clinica', clinicObject);
      await clinicReservationObj.save();
    }
    
    return true;
  } catch (error) {
    console.log(`Ha ocurrido un error ${error}`);
    return false;
  }
}

/**
 * Deletes clinic in DB
 * @param {array} clinicData 
 * @param {*} users 
 */
export async function deleteClinic(clinicData) {
  // Get sitio
  const sitioQuery = new Parse.Query(SITIO_MODEL);
  const sitioObject = await sitioQuery.get(clinicData.sitio.objectId);

  // Update clinic data
  const clinicQuery = new Parse.Query(CLINICA_MODEL);
  const clinicObject = await clinicQuery.get(clinicData.objectId);
  const clinic = await clinicQuery.find();

  await deleteClinicReservations(clinicObject);
  await Parse.Object.destroyAll(clinic);
}