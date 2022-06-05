import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import '../css/Dashboard.css';
import Card from 'react-bootstrap/Card';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'


function InfoUsuario() {

  return (
    <Card className="profile-card">
      <Container className="profile-container">
        <Row xs={2} md={4} lg={6}>
          <Col sm>
            <ion-icon name="person-circle-outline" style={{fontSize: '10em'}}></ion-icon>
          </Col>
          <Col sm>
            <h6>Usuario:</h6> Usuario ejemplo <br />
            <br />
            <h6>Correo electrónico:</h6>
            correo@ejemplo.com
          </Col>
          <Col sm>
            <h6>Numero de acceso:</h6> 0176<br />
            <br />
            <h6>Status</h6>
            Activo
          </Col>
          <Col sm>
            <h6>Cuentas asociadas:</h6>
            <ol>
                <li>Ejemplo 1</li>
                <li>Ejemplo 2</li>
                <li>Ejemplo 3</li>
                <li>Ejemplo 4</li>
            </ol>
          </Col>
          <Col sm>
            <h6>Pases de socios:</h6>
            <Form>
            <InputGroup className="mb-3">
                <Form.Control
                placeholder="No. de pases"
                aria-describedby="basic-addon2"
                />
                <Button className= "btn-submit-pases-socio" variant="outline-secondary" type="submit">
                Enviar
                </Button>
            </InputGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

export default InfoUsuario;
