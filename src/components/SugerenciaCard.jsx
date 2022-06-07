import Modal from 'react-bootstrap/Modal';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import {useState} from 'react';
import {setPasesSocio} from '../utils/client';
import '../css/PerfilSocios.css';

const SugerenciaCard = props => {
  const [showFull, setShowFalse] = useState(false);
  const handleCloseFull = () => setShowFalse(false);
  const handleShowFull = () => setShowFalse(true);
  /*const confirmDelete = ObjId => {
    confirmAlert({
      title: 'Descartar sugerencia',
      message: '¿Deseas decartar esta sugerencia?',
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
  };*/

  return (
    <div>
      <div onClick={e => e.stopPropagation()}>
        <Modal size="lg" show={showFull} onHide={handleCloseFull}>
          <Modal.Body>
            Área: {props.props.attributes.area.attributes.nombre} <br />
            Comentario: {props.props.attributes.comentarios}
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-publicar" onClick={handleCloseFull}>
              Cerrar
            </Button>
            <button className="btn-eliminar-sugerencia">
              <ion-icon name="trash-outline" style={{fontSize: '1.25em'}}></ion-icon>
            </button>
          </Modal.Footer>
        </Modal>
      </div>
      <Container>
        <Row xs={1} s={2} md={3} className="g-4">
          <Col>
            <Card className="card-sugerencias" onClick={handleShowFull}>
              <Card.Text>
                <div className="card-sugerencias-contenido">
                  Área: {props.props.attributes.area.attributes.nombre} <br />
                  Comentario: {props.props.attributes.comentarios}
                </div>
              </Card.Text>
              <Card.Footer>
                <div className="d-flex"></div>
              </Card.Footer>
              Haz Clic para ver detalles
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default SugerenciaCard;
