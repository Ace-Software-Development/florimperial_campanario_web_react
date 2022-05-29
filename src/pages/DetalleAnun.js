import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Parse from "parse";
import "../css/DetalleAnun.css";
import Button from "react-bootstrap/Button";
import React from "react";
import {  useParams} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function DetalleAnun() {
    // The <Route> that rendered this component has a
    // path of `/topics/:topicId`. The `:topicId` portion
    // of the URL indicates a placeholder that we can
    // get from `useParams()`.
    let { anuncioId } = useParams();
    const [anuncios, setAnuncios] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [anuncioTitle, setAnuncioTitle] = useState("");
    const [anuncioContent, setAnuncioContent] = useState("");  
    const [validated, setValidated] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    async function getAnuncios() {
        const query = new Parse.Query("Anuncio");
        // query donde no esten eliminados
        query.equalTo("objectId", anuncioId);
        const anuncios = await query.find();

        const result = new Array();
        for (var i = 0; i < anuncios.length; i++) {
       // console.log(anuncios[i]);

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
       // setAnuncioObject(anuncios[i]);

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
  if (loading)
  return (
    <Row className="d-flex justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </Row>
  );
  
  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = function () {
    //  console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }



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
    //  const img64 = getBase64(fileUploadControl); // prints the base64 string<
      const img2 = new Parse.File(`imgEdit-${anuncioTitle}`, fileUploadControl);
    
      setButtonDisabled(true); // <-- disable the button here
        console.log("saving img");
      img2.save().then(
        function () {
          // The file has been saved to Parse.
            console.log("saved img");
            const query = new Parse.Query(Anuncio);
            
            query.get(anuncios[0][4])
            .then((anuncioObject) => {
                console.log("anuncio object = ", anuncioObject);
                anuncioObject.set("titulo", anuncioTitle);
                anuncioObject.set("contenido", anuncioContent);
                anuncioObject.set("imagen", img2);
                anuncioObject
                  .save()
                  .then(
                    (newAnuncio) => {
                      // Execute any logic that should take place after the object is saved.
                      alert("Announcement updated with objectId: " + newAnuncio.id);
                    },
                    (error) => {
                      // Execute any logic that should take place if the save fails.
                      // error is a Parse.Error with an error code and message.
                      setButtonDisabled(false); // <-- disable the button here
      
                      alert(
                        "Failed to update object, with error code: " + error.message
                      );
                      console.log(error.message);
                    }
                  );
                setAnuncioContent("");
                setAnuncioTitle("");
                handleClose();
                //window.location.reload();
                setValidated(true);



                
            // The object was retrieved successfully.
            }, (error) => {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
            });
            
          

        },
        function (error) {
          // The file either could not be read, or could not be saved to Parse.
          console.log(error);
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
                defaultValue={`${anuncios[0][0]}`} 

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
            defaultValue={`${anuncios[0][1]}`} 
            required 
            onChange={(event) =>
              setAnuncioContent(event.currentTarget.value)
            }
            />
            <Form.Control.Feedback type="invalid">
              Por favor ingresa el contenido del anuncio aquí.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="12"  >
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
        <h2 className="spacing"> Detalles de anuncio </h2>
      </header>

      <div className="posts-container"></div>

      <div onClick={(e) => e.stopPropagation()}>
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Editar anuncio</Modal.Title>
          </Modal.Header>
          <Modal.Body>

          {testform}

                      </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" form="createAnnouncementForm"  disabled ={buttonDisabled}>
              Guardar edición
            </Button>
          </Modal.Footer>
        </Modal>
      </div>


      <Container>
       

     
        <Row  >
            <Col>
                <a href= "/anuncios" > <ion-icon name="arrow-back-outline" className="arrow-icon" ></ion-icon></a>
            </Col>
             
        </Row>
        <Row>
           
            <Col>
                   
                <img src= {`${anuncios[0][2]}`}  className='img-fluid rounded img-anuncio' alt={`${anuncios[0][0]}`} /> 
                <br/><br/>
                


            </Col>

            <Col>   
                <h3> {anuncios[0][0]} </h3>
                <hr/>
                {anuncios[0][1]}
            </Col>

        </Row>
        
        <Row>
                    <Col> 
                        <Button variant="primary" className="btn-trash"  >
                            <h4>Eliminar anuncio</h4>
                            <ion-icon name="trash-outline" ></ion-icon>
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="primary" className="btn-trash"  onClick={handleShow} >
                            <h4>Editar anuncio</h4>
                            <ion-icon name="create-outline"></ion-icon>                        </Button>
                    </Col>
                </Row>
        

      </Container>

      <div></div>
 
    </div>
    );
  }
