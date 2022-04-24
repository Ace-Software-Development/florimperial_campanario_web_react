import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {render} from "react-dom";
import Parse from "parse";
import "./Anuncios.css";
import { useParseQuery } from "@parse/react";
import ParseObject from "parse/lib/browser/ParseObject";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useForm } from "react-hook-form";


export default function Anuncios() {
  const history = useHistory();
  const [anuncioTitle, setAnuncioTitle] = useState("");
  const [anuncioContent, setAnuncioContent] = useState("");
  const [anuncios, setAnuncios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  let { path, url } = useRouteMatch();
  const [validated, setValidated] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  async function getAnuncios() {
    const query = new Parse.Query("Anuncio");
    // query donde no esten eliminados
    const anuncios = await query.find();

    const result = new Array();
    for (var i = 0; i < anuncios.length; i++) {
      console.log(anuncios[i].get("titulo"));

      result.push(
        new Array(
          anuncios[i].get("titulo"),
          anuncios[i].get("contenido"),
          anuncios[i].get("imagen").url(),
          anuncios[i].get("updatedAt"),
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
  if (loading)
    return (
      <Row className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Row>
    );

  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  const handleSubmitPost = (e) => {
    e.preventDefault();
    const Anuncio = Parse.Object.extend("Anuncio");
    const fileUploadControl = document.getElementById("formImg").files[0];

    console.log("imprimiendo register:", fileUploadControl);
    const img64 = getBase64(fileUploadControl); // prints the base64 string<
    const img2 = new Parse.File(`img-${anuncioTitle}`, fileUploadControl);
    img2.save().then(
      function () {
        // The file has been saved to Parse.
        const newAnuncio = new Anuncio();
        newAnuncio
          .save({
            titulo: anuncioTitle,
            contenido: anuncioContent,
            imagen: img2,
          })
          .then(
            (newAnuncio) => {
              // Execute any logic that should take place after the object is saved.
              alert("New object created with objectId: " + newAnuncio.id);
            },
            (error) => {
              // Execute any logic that should take place if the save fails.
              // error is a Parse.Error with an error code and message.
              alert(
                "Failed to create new object, with error code: " + error.message
              );
              console.log(error.message);
            }
          );
        setAnuncioContent("");
        setAnuncioTitle("");
        handleClose();
      },
      function (error) {
        // The file either could not be read, or could not be saved to Parse.
        alert("the parse file could not be created, with error: ", error);
      }
    );

     //window.location.reload();
  };

  console.log(anuncios);
  const listItems = anuncios.map((anuncio) => (
    <Col >
      <Card
        className="bg-image text-white"
        style={{
          width: "100%",
          height: "12rem",
          borderRadius: "5%",
          background: `rgba(0, 0, 0, .65) url(${anuncio[2]})`,
          "background-blend-mode": "darken"
        }}
      >
        <Card.Body
          className="d-flex align-items-end"
          style={{ "text-shadow": "1px 1px #000000" }}
        >
          <Card.Text>{anuncio[0]}</Card.Text>
         </Card.Body>
        <a href={`${url}/${anuncio[4]}`} class="stretched-link"></a>
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
  
      console.log("imprimiendo register:", fileUploadControl);
      const img64 = getBase64(fileUploadControl); // prints the base64 string<
      const img2 = new Parse.File(`img-${anuncioTitle}`, fileUploadControl);
      setButtonDisabled(true); // <-- disable the button here

      img2.save().then(
        function () {
          // The file has been saved to Parse.
          const newAnuncio = new Anuncio();
          newAnuncio
            .save({
              titulo: anuncioTitle,
              contenido: anuncioContent,
              imagen: img2,
            })
            .then(
              (newAnuncio) => {
                // Execute any logic that should take place after the object is saved.
                alert("New object created with objectId: " + newAnuncio.id);
              },
              (error) => {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                setButtonDisabled(false); // <-- disable the button here

                alert(
                  "Failed to create new object, with error code: " + error.message
                );
                console.log(error.message);
              }
            );
          setAnuncioContent("");
          setAnuncioTitle("");
          handleClose();
          window.location.reload();
          setValidated(true);
        },
        function (error) {
          // The file either could not be read, or could not be saved to Parse.
          alert("the parse file could not be created, with error: ", error);
        }
      );
     
 
    
      }
          

    };
  
    return (
      <Form noValidate validated={validated} onSubmit={handleSubmit}   id = "createAnnouncementForm">
        <Row className="mb-3">
       

          <Form.Group as={Col} md="12" controlId="formTitulo">
            <Form.Label>Título del anuncio</Form.Label>
            <InputGroup hasValidation>
               <Form.Control
                type="text"
                placeholder="Ingresa el título del anuncio"
                required
                onChange={(event) =>
                  setAnuncioTitle(event.currentTarget.value)
                  
                }
              />
              
              <Form.Control.Feedback type="invalid">
                Por favor introduce un título para el anuncio.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12" controlId="formContenido">
            <Form.Label>Contenido del anuncio</Form.Label>
            <Form.Control 
            as="textarea"
            type="text" 
            placeholder="Ingresa aquí el contenido del anuncio." 
            required 
            onChange={(event) =>
              setAnuncioContent(event.currentTarget.value)
            }
            />
            <Form.Control.Feedback type="invalid">
              Por favor ingresa el contenido del anuncio aquí.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="12" controlId="formImg">
            <Form.Label>Agregar una imagen para el anuncio</Form.Label>
            <Form.Control 
            type="file" 
            id = "formImg"
            accept ="image/png" 
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
      <header className="app-header">
        <h2 className="spacing"> Anuncios </h2>
      </header>
  
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
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" form="createAnnouncementForm"  disabled ={buttonDisabled}>
              Publicar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Container>
        <Row xs={1} s={2} md={3} className="g-4">
          <Col>
            <Card
              className=" text-align-center justify-content-md-center"
              style={{ width: "100%", height: "12rem", borderRadius: "5%" }}
              onClick={handleShow}
            >
              <Card.Title className="text-center ">
                {" "}
                <br /> Agregar un anuncio

              </Card.Title>
              <div style={{width:"100%", height: "100%"}}>
                <ion-icon name="add-circle-outline"   style={{ width: "30%", height: "50%" }}></ion-icon>
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
