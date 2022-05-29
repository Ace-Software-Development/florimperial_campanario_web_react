import React from "react";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Parse from "parse";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal"
import { useEffect, useState } from "react";
import CirculoCarga from "../components/CirculoCarga";
import {getPermissions} from '../utils/client'
import { useHistory } from "react-router-dom";
import Papa from "papaparse"


export default function GestionSocios() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [csvData, setCsvData] = useState(null);

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

    try {
      setLoading(true);
      const permissionsJson = await checkUser();
      setPermissions(permissionsJson);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data);
        setCsvData(results.data);
      },
    });
  };
  function CsvForm() {
    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);    
      }
      else {
        //logica de submit a base de datos, revisar logica de anuncio para referencia
        //.then( handleClose(); setValidated(true);)
      }
    };
    
    return (
      <Form noValidate validated={validated} onSubmit={handleSubmit}   id = "uploadCsv">
        <Row className="mb-3">   
          <Form.Group as={Col} md="12" controlId="csvForm">
            <Form.Label >Sube aquí el archivo csv</Form.Label>
            <Form.Control 
            type="file" 
            id = "csvForm"
            accept =".csv"
            onChange={changeHandler} 
            required />
            <Form.Control.Feedback type="invalid">
              Por favor sube aquí el archivo CSV con la información de los socios.
            </Form.Control.Feedback>
          </Form.Group>
         
        </Row>
       
      </Form>
    );
  }  
  const csvForm = CsvForm();

  return (
    <div className="App">
    
    <div onClick={(e) => e.stopPropagation()}>
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Registrar socios en el sistema</Modal.Title>
          </Modal.Header>
          <Modal.Body>

          {csvForm}

                      </Modal.Body>
          <Modal.Footer>
            <Button className="btn-campanario" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" form="uploadCsv" className="btn-publicar" disabled ={buttonDisabled}>
              Registrar socios
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Sidebar permissions = {permissions}/>
      <Header processName={"Gestión de socios"}/>
       <Container>
        <Row xs={1} s={2} md={3} className="g-5">
          <Col>
            <Card
              onClick={handleShow}
                style={{ width: '18rem', height:'100%' }}
              className="card-img top-50 start-50 translate-middle "
            >
              <Card.Title className="text-center card-title">
                <br /> Cargar datos
              </Card.Title>
              <div className="d-flex">
                <ion-icon name="add-circle-outline" class="icon-plus" ></ion-icon>
                </div>
                <a href="#" class="stretched-link"></a>
            </Card>
          </Col>
          </Row>
      </Container>
      <div></div>
    </div>
  );
}
