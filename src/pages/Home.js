import {useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom';
import Parse from 'parse';
import '../css/Home.css'
import {useParseQuery} from '@parse/react';
import ParseObject from 'parse/lib/browser/ParseObject';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Sidebar from '../components/Sidebar';

export default function Home() {
  const history = useHistory();
  const [postText, setPostText] = useState('');



  const [anuncios, setAnuncios] = useState(null);
  const [loading, setLoading] = useState(true);
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
 
    }
    
    checkUser();

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
      <Sidebar/>
      <header className="app-header">
        <h1 className="spacing">Inicio</h1>
      </header>
      
      <div className="posts-container">
        {listItems}
      </div>

      <div>

      

      </div>
    </div>
  );
}
