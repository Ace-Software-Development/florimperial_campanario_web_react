import React from "react";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default function GestionSocios() {
  return (
    <div className="App">
      <Sidebar/>
      <Header processName={"Gestión de socios"}/>
       <Container>
        <Row xs={1} s={2} md={3} className="g-5">
          <Col>
            <Card
                style={{ width: '18rem' }}
              className="card-img top-50 start-50 translate-middle "
            >
              <Card.Title className="text-center card-title">
                <br /> Cargar datos
              </Card.Title>
              <div className="d-flex">
                <ion-icon name="add-circle-outline" class="icon-plus" ></ion-icon>
                </div>
            </Card>
          </Col>
          </Row>
      </Container>

      <div></div>
    </div>
  );
}
