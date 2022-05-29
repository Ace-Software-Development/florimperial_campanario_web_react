import {useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom';
import Parse from 'parse';
import '../css/Home.css'
import {useParseQuery} from '@parse/react';
import ParseObject from 'parse/lib/browser/ParseObject';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SidenavOverlay from '../components/SidenavOverlay';
import {getPermissions} from '../utils/client'
import CirculoCarga from "../components/CirculoCarga";


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
    //  console.log(anuncios[i].get("titulo"));
      titleArray.push(anuncios[i].get("titulo"));
      contentArray.push(anuncios[i].get("contenido"));
    }
    const result = new Array();
    result.push(titleArray);
    result.push(contentArray);
    return result;
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
      try{
        const permissionsJson = await getPermissions(currentUser.attributes.AdminPermissions.id);
        return(permissionsJson);
      }
      catch(e){
        const permissionsJson={unauthorized: true};
        alert("Ha ocurrido un error al procesar tu petición. Por favor vuelve a intentarlo.");
        history.push('/');
        return(permissionsJson);
      }
    
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

  console.log(permissions);
  // if (permissions.Alberca === true)  {
  //   history.push('/');
  // };
  // return a Spinner when loading is true
  if(loading) return (
    <span><CirculoCarga/></span>
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

//console.log(anuncios[0]);
  
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
    <div className="App">
      <Sidebar permissions = {permissions} />
      <Header processName={"Inicio"}/>
      
      <div className="posts-container">
        {listItems}
      </div>
      <div>
      </div>
    </div>
  );
}
