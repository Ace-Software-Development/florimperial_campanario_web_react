import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Parse from "parse";
import Card from "react-bootstrap/Card";
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../css/DetalleAnun.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";




export default function PasswordRecovery() {
  const history = useHistory();
  const [email, setEmail] = useState(null);
 
  
  async function handleSubmit  (event)  {
    event.preventDefault();
    Parse.User.requestPasswordReset(email)
      .then(() => {
        console.log("xd0");
        alert("Se envió el email de recuperación de contraseña.");
        // Password reset request was sent successfully
      }).catch((error) => {
        // Show the error message somewhere
        console.log("xd1");
        alert("Error: " + error.code + " " + error.message);
      });
       

  
    
        

  };

  return (
    <div className="App">
      <header className="app-header">
        <h2 className="spacing"> Recuperar contraseña </h2>
      </header>
  
      <div className="posts-container"></div>



      <Container>
        <Row xs={12} s={12} md={12} className="g-4">
          <Col className="d-flex justify-content-center"  >

          <Card
            className=" d-flex text-align-center justify-content-center"
            style={{
              width: "80%",
              height: "32rem",
              borderRadius: "5%"
             
            }}
          >
            <a href= "/" > <ion-icon name="arrow-back-outline" className="arrow-icon" ></ion-icon></a>
            <Card.Body>
            <Card.Text  className=" d-flex text-align-center justify-content-center"> 
              <h3> Por favor, ingrese su correo electrónico. Recibirá una liga para recuperar su contraseña </h3>
              </Card.Text>

              <Form id = "recoverPassword"  onSubmit={handleSubmit}   >
                <Row className="mb-3">
              

                
                  <Form.Group as={Col} md="12">
                    <Form.Control 
                    type="email" 
                    id = "email"
                    required 
                    onChange={event => setEmail(event.currentTarget.value)}
                    />
                    
                  </Form.Group>
                
                </Row>

            </Form>
            
            </Card.Body>
         
            <Button  type="submit" form="recoverPassword" className="btn-publicar" > Recuperar contraseña </Button>
           
           
              
           
          </Card>

          </Col>
       
        </Row>


      </Container>

      <div></div>
    </div>
  );



}
