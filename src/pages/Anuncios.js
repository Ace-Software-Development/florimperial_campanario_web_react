import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Parse from "parse";
import "../css/Anuncios.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import CirculoCarga from "../components/CirculoCarga";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {getPermissions} from '../utils/client'

export default function Anuncios() {
  const history = useHistory();
  const [anuncios, setAnuncios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);  
  const [validated, setValidated] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [permissions, setPermissions] = useState({});



  async function getAnuncios() {
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


  useEffect(async () => {
    async function checkUser() {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        alert(
          "Necesitas haber ingresado al sistema para consultar esta página."
        );  
        history.push("/");
      }
      else if (currentUser.attributes.isAdmin === false) {
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

    console.log(permissions);

    if (permissions.Anuncios === false)  {
      alert("No tienes acceso a esta página. Para más ayuda contacta con tu administrador.");
      history.push('/home');
    };
  // return a Spinner when loading is true
  if (loading)
    return (
    <CirculoCarga/>
    );

  const confirmDelete = (ObjId) => {
    confirmAlert({
      title: 'Eliminar anuncio',
      message: '¿Estas seguro que deseas eliminar este anuncio?',
      buttons: [
        {
          label: 'No',
          onClick: () => {}
        },
        {
          label: 'Sí',
          onClick: () => {
            var yourClass = Parse.Object.extend("Anuncio");
            var query = new Parse.Query(yourClass);
            
            query.get(ObjId)
            .then((yourObj) => {
                yourObj.destroy()
                .then( () =>{
                  window.location.reload();
                }

                );
               // window.location.reload();
              },
              (error) => {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and description.
              }
            ); 
            } 
        }
        
      ]
    });
  }

  console.log(anuncios);
  const listItems = anuncios.map((anuncio) => (
    <Col >
      <Card
        className="card-container top-10 start-50 translate-middle"
      > 
      <div class ="d-flex justify-content-center">    
      
      <Card.Img className= "card-imgs card-anouncements" variant="top" src={`${anuncio[2]}`} />
      </div>
      <Card.ImgOverlay>
         <Card.Text className="d-flex justify-content-between mt-auto">  
            <h5 className= "card-title-anouncement"> {anuncio[3]} </h5> 
            <Button variant="primary" class="btn-trash" className="btn-campanario" onClick= {() => {  confirmDelete(anuncio[4]);}}  >
              <ion-icon name="trash-outline" />
            </Button>  
            
          </Card.Text>
          </Card.ImgOverlay>
      </Card>
    </Col>
  ));

  function FormExample() {
  
    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
      }
      
      else {
      const Anuncio = Parse.Object.extend("Anuncio");
      const fileUploadControl = document.getElementById("formImg").files[0];  
      const img2 = new Parse.File(`img-anuncio`, fileUploadControl);
      setButtonDisabled(true); // <-- disable the button here
      img2.save().then(
        function () {
          // The file has been saved to Parse.
          const newAnuncio = new Anuncio();
          newAnuncio
            .save({
           /*   titulo: anuncioTitle,
              contenido: anuncioContent,*/
              imagen: img2
            })
            .then(
              (newAnuncio) => {
                // Execute any logic that should take place after the object is saved.
                alert("Se ha creado un nuevo anuncio");
                 window.location.reload();

              },
              (error) => {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                setButtonDisabled(false); // <-- disable the button here

                alert(
                  "Ha ocurrido un error al crear el anuncio:  " + error.message
                );
                console.log(error.message);
              }
            );
       
          handleClose();
          setValidated(true);
        },
        function (error) {
          // The file either could not be read, or could not be saved to Parse.
          alert("No se pudo crear el anuncio. El error es: ", error);
        }
      );
     
 
    
      }
          

    };
    
    return (
      <Form noValidate validated={validated} onSubmit={handleSubmit}   id = "createAnnouncementForm">
        <Row className="mb-3">
          <Form.Group as={Col} md="12" controlId="formImg">
            <Form.Label >Agregar una imagen para el anuncio</Form.Label>
            <Form.Control 
            type="file" 
            id = "formImg"
            accept ="image/*" 
            required />
            <Form.Control.Feedback type="invalid">
              Por favor sube aquí la imagen que se agregará al anuncio.
            </Form.Control.Feedback>
          </Form.Group>
         
        </Row>
       
      </Form>
    );
  }
  
  const testform = FormExample();

  

  return (
    <div className="App">
      <Sidebar permissions = {permissions}/>
      <Header processName={"Anuncios"}/>
  
      <div className="posts-container"></div>

      <div onClick={(e) => e.stopPropagation()}>
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Crear anuncio</Modal.Title>
          </Modal.Header>
          <Modal.Body>

          {testform}

                      </Modal.Body>
          <Modal.Footer>
            <Button className="btn-campanario" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" form="createAnnouncementForm" className="btn-publicar" disabled ={buttonDisabled}>
              Publicar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Container>
        <Row xs={1} s={2} md={3} className="g-4">
          <Col>
            <Card
              className="card-imgs top-50 start-50 translate-middle "
              onClick={handleShow}
            >
              <Card.Title className="text-center card-title-anuncios">

                <br /> Agregar un anuncio

              </Card.Title>
              <div className="d-flex">
                <ion-icon name="add-circle-outline" class="icon-plus-anuncios" ></ion-icon>
                </div>

            

              <a href="#" class="stretched-link"></a>
            </Card>
          </Col>
          {listItems}
        </Row>


      </Container>

      <div></div>
    </div>
  );



}
