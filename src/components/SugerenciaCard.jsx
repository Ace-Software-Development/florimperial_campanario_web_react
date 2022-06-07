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
            <h5>{props.props.attributes.area.attributes.nombre} </h5>
            Comentario: {props.props.attributes.comentarios}
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-publicar" onClick={handleCloseFull}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
            <Card className="card-sugerencias" >
              <Card.Text onClick={handleShowFull}>
                <div className="card-sugerencias-contenido" >
                  <h5>{props.props.attributes.area.attributes.nombre}</h5>
                  Comentario: {props.props.attributes.comentarios}
                </div>
              </Card.Text>
              <Card.Footer>
                <div className="d-flex"></div>
                <button className="btn-eliminar-sugerencia">
              <ion-icon name="trash-outline" style={{fontSize: '1.25em'}}></ion-icon>
            </button>
              </Card.Footer>
            </Card>
    </div>
  );
};
export default SugerenciaCard;
