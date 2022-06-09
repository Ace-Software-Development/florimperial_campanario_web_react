import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Parse from 'parse';
import '../css/Anuncios.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import CirculoCarga from '../components/CirculoCarga';
import Screen from '../components/Screen';
import {getAnuncios, checkUser} from '../utils/client';

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

  useEffect(async () => {
    const permissionsJson = await checkUser();
    if (permissionsJson === 'NO_USER') {
      alert('Necesitas haber ingresado al sistema para consultar esta página.');
      history.push('/');
    } else if (permissionsJson === 'NOT_ADMIN') {
      alert('Necesitas ser administrador para acceder al sistema.');
      history.push('/');
    } else if (permissionsJson === 'INVALID_SESSION') {
      alert('Tu sesión ha finalizado. Por favor, inicia sesión nuevamente.');
      history.push('/');
    }
    if (permissionsJson.Anuncios === false) {
      alert('No tienes acceso a esta página. Para más ayuda contacta con tu administrador.');
      history.push('/home');
    }
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

  // return a Spinner when loading is true
  if (loading) return <CirculoCarga />;

  const confirmDelete = ObjId => {
    confirmAlert({
      title: 'Eliminar anuncio',
      message: '¿Estas seguro que deseas eliminar este anuncio?',
      buttons: [
        {
          label: 'No',
          onClick: () => {},
        },
        {
          label: 'Sí',
          onClick: () => {
            var yourClass = Parse.Object.extend('Anuncio');
            var query = new Parse.Query(yourClass);

            query.get(ObjId).then(
              yourObj => {
                yourObj.destroy().then(() => {
                  window.location.reload();
                });
                // window.location.reload();
              },
              error => {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and description.
              }
            );
          },
        },
      ],
    });
  };

  console.log(anuncios);
  const listItems = anuncios.map(anuncio => (
    <Col>
      <Card className="card-container top-10 start-50 translate-middle">
        <div class="d-flex justify-content-center">
          <Card.Img className="card-imgs card-anouncements" variant="top" src={`${anuncio[2]}`} />
        </div>
        <Card.ImgOverlay className= "anuncios-card-overlay">
            <Container className="card-container-anuncios">
              <Row>
                <Card.Text className="d-flex justify-content-between mt-auto">
                <Col style={{textAlign:'left'}} >
                <h5 className="card-title-anouncement"> {anuncio[3]} </h5>
                </Col>
                <Col md={{ offset: 7 }}>
                <Button
                style={{fontSize: '1.25em'}}
                  variant="primary"
                  className ="btn-trash-anuncios"
                  onClick={() => {
                  confirmDelete(anuncio[4]);
              }}
            >
              <ion-icon name="trash-outline" />
              </Button>
                </Col>
              </Card.Text>
              </Row>
            </Container>

        </Card.ImgOverlay>
      </Card>
    </Col>
  ));

  function FormExample() {
    const handleSubmit = event => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
      } else {
        const Anuncio = Parse.Object.extend('Anuncio');
        const fileUploadControl = document.getElementById('formImg').files[0];
        const img2 = new Parse.File(`img-anuncio`, fileUploadControl);
        setButtonDisabled(true); // <-- disable the button here
        img2.save().then(
          function() {
            // The file has been saved to Parse.
            const newAnuncio = new Anuncio();
            newAnuncio
              .save({
                /*   titulo: anuncioTitle,
              contenido: anuncioContent,*/
                imagen: img2,
              })
              .then(
                newAnuncio => {
                  // Execute any logic that should take place after the object is saved.
                  alert('Se ha creado un nuevo anuncio');
                  window.location.reload();
                },
                error => {
                  // Execute any logic that should take place if the save fails.
                  // error is a Parse.Error with an error code and message.
                  setButtonDisabled(false); // <-- disable the button here

                  alert('Ha ocurrido un error al crear el anuncio:  ' + error.message);
                  console.log(error.message);
                }
              );

            handleClose();
            setValidated(true);
          },
          function(error) {
            // The file either could not be read, or could not be saved to Parse.
            alert('No se pudo crear el anuncio. El error es: ', error);
          }
        );
      }
    };

    return (
      <Form noValidate validated={validated} onSubmit={handleSubmit} id="createAnnouncementForm">
        <Row className="mb-3">
          <Form.Group as={Col} md="12" controlId="formImg">
            <Form.Label>Agregar una imagen para el anuncio</Form.Label>
            <Form.Control type="file" id="formImg" accept="image/*" required />
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
    <Screen permissions={permissions} title="Anuncios">
      <div className="App">
        <div onClick={e => e.stopPropagation()}>
          <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Crear anuncio</Modal.Title>
            </Modal.Header>
            <Modal.Body>{testform}</Modal.Body>
            <Modal.Footer>
              <Button className="btn-campanario" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                form="createAnnouncementForm"
                className="btn-publicar"
                disabled={buttonDisabled}
              >
                Publicar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <Container className="anuncios-content">
          <Row xs={1} s={2} md={3} className="g-5">
            <Col>
              <Card className="card-imgs top-50 start-50 translate-middle " onClick={handleShow}>
                <div className="center-content-anuncios">
                <Card.Title className="text-center card-title-anuncios">
                  <br /> Agregar un anuncio
                </Card.Title>
                <div className="d-flex">
                  <ion-icon name="add-circle-outline" class="icon-plus-anuncios"></ion-icon>
                </div>
                </div>

                <a href="#" class="stretched-link"></a>
              </Card>
            </Col>
            {listItems}
          </Row>
        </Container>
      </div>
    </Screen>
  );
}
