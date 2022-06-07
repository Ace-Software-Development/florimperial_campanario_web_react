import Parse from 'parse';
import ParseUser from 'parse/lib/browser/ParseUser';

const RESERVACION_MODEL = Parse.Object.extend('Reservacion');
const RESERVACION_GOLF_MODEL = Parse.Object.extend('ReservacionGolf');
const AREA_MODEL = Parse.Object.extend('Area');
const SITIO_MODEL = Parse.Object.extend('Sitio');
const USER_MODEL = Parse.Object.extend('_User');
const COACH_MODEL = Parse.Object.extend('Profesor');
const RESERVACION_INVITADO_MODEL = Parse.Object.extend('ReservacionInvitado');
const INVITADO_MODEL = Parse.Object.extend('Invitado');
const MULTIPLE_RESERVATION_MODEL = Parse.Object.extend('ReservacionMultiple');

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
      console.log('resultados -> ', results);
      Parse.Object.destroyAll(results);
    });
  }
}

/**
 * updates a golf reservation in the DB
 * @param {array} dataReservation
 * @param {array} guests
 * @returns true if reservation data saved succesfully
 * else @returns false
 */
export async function updateGolfReservation(dataReservation, guests) {
  try {
    // Create GolfReservation entry
    if (dataReservation.reservacionGolf) {
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
      if (!dataReservation[key]) continue;

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

    return true;
  } catch (error) {
    console.log(`Ha ocurrido un error ${error}`);
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
/*
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
  } else if (currentUser.attributes.isAdmin === false) {
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
  let accountPointer = {
    __type: 'Pointer',
    className: 'Cuenta',
    objectId: accountId,
  };
  const newUser = new Parse.User();
  newUser.set('username', email);
  newUser.set('email', email);
  newUser.set('password', pass);
  newUser.set('account', accountPointer);
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
  // reservationQuery.equalTo('estatus', 2);
  reservationQuery.include('sitio');

  let data = await reservationQuery.find();

  const multipleReservationIdQuery = new Parse.Query(MULTIPLE_RESERVATION_MODEL);
  multipleReservationIdQuery.equalTo('user', userObj);
  //multipleReservationIdQuery.include('reservacion');
  //multipleReservationIdQuery.include('reservacion.sitio');
  //multipleReservationIdQuery.include('reservacion.sitio.area');
  let reservacionMultipeList = await multipleReservationIdQuery.find();
  /*
  await Promise.all(
    reservacionMultipeList.map(async object => {
      const multipleReservationQuery = new Parse.Query(RESERVACION_MODEL);
      multipleReservationQuery.equalTo('objectId', object.get('reservacion').id);
      multipleReservationQuery.include('sitio');
      multipleReservationQuery.include('sitio.area');
      let reservacion = await multipleReservationQuery.find();
      console.log(reservacion, object.get('reservacion').id);
      data.push(reservacion[0]);
    })
  ); */
  /*
  reservacionMultipeList.forEach(async object => {
    await object.get('reservacion').fetch();
  });*/

  //  console.log('dataxd', reservacionMultipeList);
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

export async function getCuenta() {
  const cuentaQuery = new Parse.Query('_User');
  let data = await cuentaQuery.find();
  return data;
}

export async function getMembers() {
  const cuentaQuery = new Parse.Query('_User');
  cuentaQuery.equalTo('isAdmin', false);
  cuentaQuery.include('account');
  cuentaQuery.include('account.noAccion'); // if user is the column name
  cuentaQuery.include('account.pases'); // if activity is the column name
  //cuentaQuery.notEqualTo('email', 'null');
  let data = await cuentaQuery.find();
  return data;
}

/**
 * setSupportNumber
 * @description it sets a new support number
 * @param {number} idNumero: the Number objectId
 * @param {number} nuevoNum: the new value for attribute Numero
 */
export async function setPasesSocio(objId, numPases) {
  console.log('hola');
  const query = new Parse.Query('Cuenta');
  query.equalTo('objectId', objId);
  const result = await query.find();
  const cuentaEnDb = result[0];
  await cuentaEnDb.set('pases', numPases);
  await cuentaEnDb.save();
}
