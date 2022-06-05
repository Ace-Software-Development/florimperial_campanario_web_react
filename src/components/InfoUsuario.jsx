import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import '../css/Dashboard.css';
import Card from 'react-bootstrap/Card';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

function InfoUsuario(props) {
  props = props.props;
  console.log(props);
  const user = props[0];
  const rol = props[1];
  return (
    <Card className="profile-card">
      <Container className="profile-container">
        <Row xs={2} md={4} lg={6}>
          <Col sm>
            <ion-icon name="person-circle-outline" style={{fontSize: '10em'}}></ion-icon>
          </Col>
          <Col sm>
            <h6>Usuario:</h6> {user.attributes.username} <br />
            <br />
            <h6>Rol actual:</h6>
            {rol.attributes.rol.attributes.NombreRol}
          </Col>
          <Col sm>
            <h6>Correo electrónico:</h6> {user.attributes.email} <br />
            <br />
            <h6>Numero de nómina:</h6>
            {rol.attributes.Nomina}
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

export default InfoUsuario;
