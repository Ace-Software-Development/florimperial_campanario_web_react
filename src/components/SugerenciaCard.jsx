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
                <div className="d-flex">
                  <button className="btn-eliminar-sugerencia">
                    <ion-icon name="trash-outline" style={{fontSize: '1.25em'}}></ion-icon>
                  </button>
                </div>
              </Card.Footer>
              <a href="#" class="stretched-link"></a>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default SugerenciaCard;
