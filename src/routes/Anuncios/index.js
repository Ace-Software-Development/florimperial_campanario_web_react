import {useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom';
import Parse from 'parse';
import './Anuncios.css'
import {useParseQuery} from '@parse/react';
import ParseObject from 'parse/lib/browser/ParseObject';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form'
import { useForm } from "react-hook-form";


export default function Anuncios() {
  const history = useHistory();
  const [anuncioTitle, setAnuncioTitle] = useState('');
  const [anuncioContent, setAnuncioContent] = useState('');
  const [imgForm, setImgForm] = useState('');
  const  {register, getValues} = useForm();

  const [anuncios, setAnuncios] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  async function getAnuncios() {
    const query = new Parse.Query('Anuncio');
    // query donde no esten eliminados
    const anuncios = await query.find();
   
    const result = new Array();
    for (var i = 0; i < anuncios.length; i++){
      console.log(anuncios[i].get("titulo"));
    
     result.push(new Array(anuncios[i].get("titulo"), anuncios[i].get("contenido")));
    }
   
   
    return result;
  }


  useEffect(async() => {
    async function checkUser() {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        alert('Necesitas haber ingresado al sistema para consultar esta página.');
        history.push('/');
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

    <Row className="d-flex justify-content-center"> 
         <Spinner animation="border" role="status" >
    <span className="visually-hidden">Loading...</span>
  </Spinner>
  </Row>
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
  
function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    console.log(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}



  const handleSubmitPost = (e) => {
    e.preventDefault();
    const Anuncio = Parse.Object.extend("Anuncio");
    const fileUploadControl = document.getElementById("formImg").files[0];

    console.log("imprimiendo register:", fileUploadControl);
   // console.log(getValues("formImg")[0]);
   // const img = getValues("formImg")[0];
    //console.log(img2);
    const img64 = getBase64(fileUploadControl); // prints the base64 string<
    //console.log(img64);
    const img2 = new Parse.File(`img-${anuncioTitle}`, fileUploadControl);
    img2.save().then(function() {

      // The file has been saved to Parse.
        const newAnuncio = new Anuncio();
        newAnuncio.save({
          titulo: anuncioTitle,
          contenido: anuncioContent,
          imagen: img2
        })
        .then((newAnuncio) => {
          // Execute any logic that should take place after the object is saved.
          alert('New object created with objectId: ' + newAnuncio.id );
        }, (error) => {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
          console.log(error.message);
        });
        setAnuncioContent("");
        setAnuncioTitle("");
        handleClose();
  

    }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
      alert("the parse file could not be created, with error: ", error)
    });

   // window.location.reload();
  };

  // var items =  new Array();  
  // items = anunciosGlobal.map((anuncio) =>
  //   <li>{ anuncio }</li>
  // );
  console.log(anuncios);
  const listItems = anuncios.map((anuncio) =>

    <Col >
  <Card className="bg-dark text-white" style={{ width: '100%', height: '12rem' , 'borderRadius': '5%' }} >
     <Card.Img variant="top" src="logo512.png"className='w-50 h-100 rounded mx-auto d-block' />
    <Card.ImgOverlay>
    <Card.Title>{anuncio[0]}</Card.Title>
    <Card.Text>
    {anuncio[1]}  
    </Card.Text>
    <Button variant="primary">Go somewhere</Button>
    </Card.ImgOverlay>
    
 </Card>
 </Col>

 
);

  return (
    <div className="App">
      <header className="app-header">
     <h2 className="spacing"> Anuncios </h2>
       
      </header>
      
      <div className="posts-container">
       
       
        
      </div>


      <div onClick={e => e.stopPropagation()}> 
      <Modal size = "lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear anuncio</Modal.Title>
        </Modal.Header>
        <Modal.Body>

      <Form  onSubmit={handleSubmitPost}>
         <Form.Group className="mb-3" controlId="formTitulo">
            <Form.Label>Título del anuncio</Form.Label>
            <Form.Control type="text" placeholder="Ingresa el título del anuncio"  onChange={event => setAnuncioTitle(event.currentTarget.value)}/>
          </Form.Group>        

          <Form.Group className="mb-3" controlId="formContenido">
            <Form.Label>Contenido del anuncio</Form.Label>
            
            <Form.Control as="textarea" type="text" placeholder="Ingresa el contenido del anuncio"  onChange={event => setAnuncioContent(event.currentTarget.value)}/>
          </Form.Group>    

          <Form.Group controlId="formImg" className="mb-3">
            <Form.Label>Agregar imagen para el anuncio</Form.Label>
            <Form.Control required = "true" type="file" id="formImg" accept="image/png" />
          </Form.Group>
       

      </Form>



        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmitPost}>
            Publicar
          </Button>
        </Modal.Footer>
      </Modal>
      </div>


      <Container>
        <Row  xs={1} s={2} md={3} className="g-4">
          <Col>
          <Card className="bg-dark text-white text-align-center " style={{ width: '100%', height: '12rem', 'borderRadius': '5%' }} onClick={handleShow} >
          
           <Card.Title className="text-center"> <br/> Agregar un anuncio</Card.Title>



            <Card.Text>
             
            </Card.Text>
            <Card.Img variant="top" src="plus.png"  className='rounded mx-auto d-block ' style={{ width: '30%', height: '50%'}} />
          
            
    
          </Card>
          
          </Col>
          {listItems}
        </Row>
      </Container>
   
      <div>

      

      </div>
    </div>
  );
}
