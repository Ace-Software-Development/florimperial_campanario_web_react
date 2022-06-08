import Modal from 'react-bootstrap/Modal';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import {useState} from 'react';
import {deleteSugerencia} from '../utils/client';
import '../css/PerfilSocios.css';

const SugerenciaCard = props => {
  const [showFull, setShowFalse] = useState(false);
  const handleCloseFull = () => setShowFalse(false);
  const handleShowFull = () => setShowFalse(true);

  const handleDeleteSuggestion = event => {
    const button = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    const idSugerencia = button.id;

    deleteSugerencia(idSugerencia).then(() => {
      alert('Se eliminó la sugerencia exitosamente.');
      window.location.reload();
    });
  };

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
      <Card className="card-sugerencias">
        <Card.Text onClick={handleShowFull}>
          <div className="card-sugerencias-contenido">
            <h5>{props.props.attributes.area.attributes.nombre}</h5>
            Comentario: {props.props.attributes.comentarios}
          </div>
        </Card.Text>
        <Card.Footer>
          <div className="d-flex"></div>
          <button
            className="btn-eliminar-sugerencia"
            id={props.props.id}
            onClick={handleDeleteSuggestion}
          >
            <ion-icon name="trash-outline" style={{fontSize: '1.25em'}}></ion-icon>
          </button>
        </Card.Footer>
      </Card>
    </div>
  );
};
export default SugerenciaCard;
