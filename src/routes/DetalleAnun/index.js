import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Parse from "parse";
import "./DetalleAnun.css";
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
import { useForm } from "react-hook-form";

import Image from 'react-bootstrap/Image'


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

    
    async function getAnuncios() {
        const query = new Parse.Query("Anuncio");
        // query donde no esten eliminados
        query.equalTo("objectId", anuncioId);
        const anuncios = await query.find();

        const result = new Array();
        for (var i = 0; i < anuncios.length; i++) {
        console.log(anuncios[i]);

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
  if (loading)
  return (
    <Row className="d-flex justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Row>
  );

    return (
   
      <div className="App">
   
      <header className="app-header">
        <h2 className="spacing"> Detalles de anuncio </h2>
      </header>

      <div className="posts-container"></div>

      <div onClick={(e) => e.stopPropagation()}>
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Crear anuncio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form  >
              <Form.Group className="mb-3" controlId="formTitulo">
                <Form.Label>Título del anuncio</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el título del anuncio"
                  onChange={(event) =>
                    setAnuncioTitle(event.currentTarget.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formContenido">
                <Form.Label>Contenido del anuncio</Form.Label>

                <Form.Control
                  as="textarea"
                  type="text"
                  placeholder="Ingresa el contenido del anuncio"
                  onChange={(event) =>
                    setAnuncioContent(event.currentTarget.value)
                  }
                />
              </Form.Group>

              <Form.Group controlId="formImg" className="mb-3">
                <Form.Label>Agregar imagen para el anuncio</Form.Label>
                <Form.Control
                  required="true"
                  type="file"
                  id="formImg"
                  accept="image/png"
                /> 
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" >
              Publicar
            </Button>
          </Modal.Footer>
        </Modal>

      </div>

      <Container>
       

     
        <Row >
        <a href= "/anuncios" > <ion-icon name="arrow-back-outline"  ></ion-icon>
        </a>
        </Row>
        <Row>
           
            <Col>
                   
                <img src= {`${anuncios[0][2]}`}  className='img-fluid rounded' alt={' {anuncios[0][0]}'} /> </Col>
            <Col>   
                <h3> {anuncios[0][0]} </h3>
                <hr/>
                {anuncios[0][1]}
            </Col>
        </Row>
 

      </Container>

      <div></div>
 
    </div>
    );
  }
