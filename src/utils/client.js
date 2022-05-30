import Parse from 'parse';


export async function loadMembers(csvData){
  try{
    console.log("subiendo...");
    for (let i = 0; i > csvData.length; i++){
       createMember(csvData[i]['E-MAIL'], csvData[i]['SOCIO'], csvData[i]['SOCIO'] ) ;
     }

     //logica de submit a base de datos, revisar logica de anuncio para referencia
     //.then( handleClose(); setValidated(true);)
  }
  catch(e){
    console.log("error en csvForm: ", e);
    alert(e);

  }
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
    newUser.save();
    return(0);
  }
  catch(e){
    console.log("Error en createMember: ", e);
    return(e);
  }
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


