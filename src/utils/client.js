import Parse from 'parse';

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

export async function getAdminUsers(){
  const query = new Parse.Query("_User");
  query.equalTo("isAdmin", true);
  const result = await query.find(); 

  return(result);
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


