import {useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom';
import Parse from 'parse';
import '../css/Home.css'
import {useParseQuery} from '@parse/react';
import ParseObject from 'parse/lib/browser/ParseObject';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Screen from '../components/Screen';
import SidenavOverlay from '../components/SidenavOverlay';

export default function Home() {
  const history = useHistory();
  const [postText, setPostText] = useState('');



  const [anuncios, setAnuncios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});


  async function getAnuncios() {
    const query = new Parse.Query('Anuncio');
    // query donde no esten eliminados
    const anuncios = await query.find();
    const titleArray = new Array();
    const contentArray = new Array();
    for (var i = 0; i < anuncios.length; i++){
      titleArray.push(anuncios[i].get("titulo"));
      contentArray.push(anuncios[i].get("contenido"));
    }
    const result = new Array();
    result.push(titleArray);
    result.push(contentArray);
    return result;
  }


  async function getPermissions(idRol) {
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


  useEffect(async() => {
    async function checkUser() {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        alert(
          "Necesitas haber ingresado al sistema para consultar esta página."
        );  
        history.push("/");
      }
      else if (currentUser.attributes.isAdmin == false) {
        alert(
          "Necesitas ser administrador para acceder al sistema."
        );
        history.push("/");
      }
      const permissionsJson = await getPermissions(currentUser.attributes.AdminPermissions.id);
      return(permissionsJson);
    }
    
    const permissionsJson = await checkUser();
    setPermissions(permissionsJson);
  

    try {
      setLoading(true);
      const anuncios = await getAnuncios();
      setAnuncios(anuncios);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  // if (permissions.Alberca === true)  {
  //   history.push('/');
  // };
  // return a Spinner when loading is true
  if(loading) return (
    <span>Cargando</span>
  );
/*
  // data will be null when fetch call fails
  if (!anuncios) return (
    <span>Data not available</span>
  );

  // when data is available, title is shown
  return (
    <span>
      {anuncios[0].get("title")}
    </span>
  );
*/

  const handleSubmitPost = (e) => {
    e.preventDefault();
    const Post = Parse.Object.extend("Post");
    const newPost = new Post();
    newPost.save()
    .then((newPost) => {
      // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + newPost.text);
    }, (error) => {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    });
    setPostText("");
  };

  // var items =  new Array();  
  // items = anunciosGlobal.map((anuncio) =>
  //   <li>{ anuncio }</li>
  // );
  
  const listItems = anuncios.map((anuncio) =>
  <Card style={{ width: '18rem' }}>
     <Card.Img variant="top" src="logo512.png" />
    <Card.Body>
    <Card.Title>
    {anuncio[0]}
    </Card.Title>
    <Card.Text>
    {anuncio[1]}  
    </Card.Text>
    <Button variant="primary">Go somewhere</Button>
    </Card.Body>
 </Card>
);

  return (
    <Screen title="Home" className="App">
      <h1 className="title-1">Header 1</h1>
      <h2 className="title-2">Header 2</h2>
      <h3 className="subtitle-1">Subtitle 1</h3>

      <div className='card-bg' style={{height: 400, width:400, marginLeft: '10%'}}>
      <h4 className='subtitle-2'>Subtitle 2</h4>
      <p className="text">Card text.....</p>
      <input type="text" className='input input-text'></input>
      <button className="primary-btn">Botón Principal</button>
      <button className="secondary-btn">Botón Secundario</button>

      </div>
    </Screen>
  );
}
