import Parse from 'parse';



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


