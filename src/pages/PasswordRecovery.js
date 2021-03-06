import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Parse from 'parse';
import Card from 'react-bootstrap/Card';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../css/PassRecovery.css';

export default function PasswordRecovery() {
  const history = useHistory();
  const [email, setEmail] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    Parse.User.requestPasswordReset(email)
      .then(() => {
        alert(
          'Se enviará un correo de recuperación de contraseña si el usuario se encuentra registrado en El Campanario.'
        );
        history.push('/');
        // Password reset request was sent successfully
      })
      .catch(error => {
        // Show the error message somewhere

        alert('Error: ' + error.code + ' ' + error.message);
      });
  }

  return (
    <div className="App">
      <header className="app-header">
        <h2 className="spacing"> Recuperar contraseña </h2>
      </header>

      <div className="posts-container"></div>

      <Container>
        <Row xs={12} s={12} md={12} className="g-4">
          <Col className="d-flex justify-content-center">
            <Card
              className="text-center position-relative"
              style={{width: '55%', background: '#ebebeb'}}
            >
              <Card.Body>
                <br />
                <h2 className="recovery-title">Recuperar Contraseña</h2>
                <br />
                <br />
                <Card.Text>
                  Por favor, ingrese su correo electrónico. Recibirá una liga para recuperar su
                  contraseña
                </Card.Text>
                <br />
                <Form id="recoverPassword" onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="12">
                      <Form.Control
                        className="form-recovery"
                        type="email"
                        id="email"
                        required
                        placeholder="Correo electrónico"
                        onChange={event => setEmail(event.currentTarget.value)}
                      />
                    </Form.Group>
                  </Row>
                </Form>
                <br />
                <Button
                  variant="primary"
                  type="submit"
                  form="recoverPassword"
                  className="btn-publicar btn-recovery"
                >
                  {' '}
                  Recuperar contraseña{' '}
                </Button>
                <br />
                <br />
                <a className="recuperar-contrasena" href="/">
                  {' '}
                  Regresar a Login
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <div></div>
    </div>
  );
}
