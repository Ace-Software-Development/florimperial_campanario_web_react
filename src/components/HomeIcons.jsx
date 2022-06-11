import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import '../css/Dashboard.css';
import Card from 'react-bootstrap/Card';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

function HomeIcons(permissions) {
  let anuncios,
    golf,
    raqueta,
    salones_gym,
    gestion,
    alberca = '';
  if (permissions.permissions.Anuncios === false) {
    anuncios = 'none';
  }
  if (permissions.permissions.Raqueta === false) {
    raqueta = 'none';
  }
  if (permissions.permissions.Salones_gym === false) {
    salones_gym = 'none';
  }
  if (permissions.permissions.Golf === false) {
    golf = 'none';
  }
  if (permissions.permissions.Gestion === false) {
    gestion = 'none';
  }
  if (permissions.permissions.Alberca === false) {
    alberca = 'none';
  }

  return (
    <div className="d-flex">
      <Container className="home-icons-container">
        <Row xs={1} s={2} md={3} className="g-4">
          <Col>
            <a href="/anuncios">
              <Card className="bg-dark text-white" style={{width: '100%', display: `${anuncios}`}}>
                <Card.Img className= "home-card-img" src="anunciosIMG.jpg" alt="Card image" />
                <Card.ImgOverlay className= "home-card-overlay">
                  <Card.Title className="home-card-title" >Anuncios</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </a>
          </Col>
          <Col>
            <a href="/golf/salidas">
              <Card className="bg-dark text-white" style={{width: '100%', display: `${golf}`}}>
                <Card.Img className= "home-card-img" src="golfIMG.png" alt="Card image" />
                <Card.ImgOverlay className= "home-card-overlay">
                  <Card.Title className="home-card-title">Golf</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </a>
          </Col>
          <Col>
            <a href="raqueta/reservaciones">
              <Card className="bg-dark text-white" style={{width: '100%', display: `${raqueta}`}}>
                <Card.Img className= "home-card-img" src="raquetaIMG.jpg" alt="Card image" />
                <Card.ImgOverlay className= "home-card-overlay">
                  <Card.Title className="home-card-title">Raqueta</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </a>
          </Col>
          <Col>
            <a href="/lista-de-socios">
              <Card className="bg-dark text-white" style={{width: '100%', display: `${gestion}`}}>
                <Card.Img className= "home-card-img" src="config.jpg" alt="Card image" />
                <Card.ImgOverlay className= "home-card-overlay">
                  <Card.Title className="home-card-title">Gestión de socios</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </a>
          </Col>
          <Col>
            <a href="/panel-de-administradores">
              <Card className="bg-dark text-white" style={{width: '100%', display: `${gestion}`}}>
                <Card.Img className= "home-card-img" src="config.jpg" alt="Card image" />
                <Card.ImgOverlay className= "home-card-overlay">
                  <Card.Title className="home-card-title">Panel de administradores</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </a>
          </Col>
          <Col>
            <a href="/gym/reservaciones">
              <Card
                className="bg-dark text-white"
                style={{width: '100%', display: `${salones_gym}`}}
              >
                <Card.Img className= "home-card-img" src="gymIMG.jpg" alt="Card image" />
                <Card.ImgOverlay className= "home-card-overlay">
                  <Card.Title className="home-card-title">Gym</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </a>
          </Col>
          <Col>
            <a href="alberca/reservaciones">
              <Card className="bg-dark text-white" style={{width: '100%', display: `${alberca}`}}>
                <Card.Img className= "home-card-img" src="poolIMG.jpg" alt="Card image" />
                <Card.ImgOverlay className= "home-card-overlay">
                  <Card.Title className="home-card-title">Alberca</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomeIcons;
