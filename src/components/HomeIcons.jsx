import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import '../css/Dashboard.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Card from 'react-bootstrap/Card';
import React from "react"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";


function HomeIcons(permissions){
    let anuncios, golf, raqueta, salones_gym, gestion, alberca = "";
    if(permissions.permissions.Anuncios === false){
        anuncios = "none";
    }
    if(permissions.permissions.Raqueta === false){
        raqueta = "none";
    }
    if(permissions.permissions.Salones_gym === false){
        salones_gym = "none";
    }
    if(permissions.permissions.Golf === false){
        golf = "none";
    }
    if(permissions.permissions.Gestion === false){
        gestion = "none";
    }
    if(permissions.permissions.Alberca === false){
        alberca = "none";
    }

    return(
    <div className="d-flex">
        <Container className="home-icons-container">
            <Row xs={1} s={2} md={3} className="g-4">
                <Col>
                    <Card className="bg-dark text-white" style={{width: "100%",display: `${anuncios}` }}>
                        <Card.Img src="holder.js/100px270" alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Title>Anuncios</Card.Title>
                        </Card.ImgOverlay>
                    </Card> 
                </Col>
                <Col>
                    <Card className="bg-dark text-white" style={{width: "100%",display: `${golf}`}}>
                        <Card.Img src="holder.js/100px270" alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Title>Golf</Card.Title>
                        </Card.ImgOverlay>
                    </Card> 
                </Col>
                <Col>
                <Card className="bg-dark text-white" style={{width: "100%",display: `${raqueta}`}}>
                        <Card.Img src="holder.js/100px270" alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Title>Raqueta</Card.Title>
                        </Card.ImgOverlay>
                    </Card> 
                </Col>
                <Col>
                    <Card className="bg-dark text-white" style={{width: "100%",display: `${gestion}`}}>
                        <Card.Img src="holder.js/100px270" alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Title>Gestión de socios</Card.Title>
                        </Card.ImgOverlay>
                    </Card> 
                </Col>
                <Col>
                <Card className="bg-dark text-white" style={{width: "100%",display: `${gestion}`}}>
                        <Card.Img src="holder.js/100px270" alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Title>Gestión de administradores</Card.Title>
                        </Card.ImgOverlay>
                    </Card> 
                </Col>
                <Col>
                    <Card className="bg-dark text-white" style={{width: "100%",display: `${salones_gym}`}}>
                        <Card.Img src="holder.js/100px270" alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Title>Gym</Card.Title>
                        </Card.ImgOverlay>
                    </Card>           
                </Col>
                <Col>
                    <Card className="bg-dark text-white" style={{width: "100%", display: `${salones_gym}`}}>
                        <Card.Img src="holder.js/100px270" alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Title>Salones</Card.Title>
                        </Card.ImgOverlay>
                    </Card> 
                </Col>
                <Col>
                    <Card className="bg-dark text-white" style={{width: "100%", display: `${alberca}`}}>
                        <Card.Img src="holder.js/100px270" alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Title>Alberca</Card.Title>
                        </Card.ImgOverlay>
                    </Card> 
                </Col>
            </Row>
      </Container>
        </div>
    )
}

export default HomeIcons