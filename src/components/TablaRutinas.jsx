import '../css/Dashboard.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormSelect from 'react-bootstrap/FormSelect';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import {useState} from 'react';

const TablaRutinas = () => {
    const [showAdd, setShowFalse] = useState(false);
    const handleCloseAdd = () => setShowFalse(false);
    const handleShowAdd = () => setShowFalse(true);
  return (
      <div>
        <div onClick={e => e.stopPropagation()}>
            <Modal size="lg" show={showAdd} onHide={handleCloseAdd}>
            <Modal.Header closeButton>
              <Modal.Title>Crear rutina</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Form>
                    <Row>
                        <Col xs={7}>
                            <Form.Group className="mb-3">
                            <Form.Label> <h6>Nombre</h6></Form.Label>
                            <Form.Control  placeholder="Nombre del ejericio" /></Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                            <Form.Label> <h6>Repeticiones</h6></Form.Label>
                            <Form.Control  placeholder="No. de Repeticiones" /></Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                            <Form.Label> <h6>Series</h6></Form.Label>
                            <Form.Control  placeholder="No. de Series" /></Form.Group>
                        </Col>
                    </Row>
                    <Row>
                            <Form.Group className="mb-3">
                            <Form.Label> <h6>Notas</h6></Form.Label>
                            <Form.Control  placeholder="Notas adicionales" as="textarea" rows={3} /></Form.Group>
                    </Row>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-publicar" onClick={handleCloseAdd}>
                Crear
                </Button>
            </Modal.Footer>
            </Modal>
        </div>
          <Container>
              <Row>
                    <Col xs={8}>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Col>
                    <Col>
                        <Form>
                            <FormSelect id="roleSelection">
                            <option>Lunes</option>
                            <option>Martes</option>
                            <option>Miercoles</option>
                            <option>Jueves</option>
                            <option>Viernes</option>
                            <option>Sabado</option>
                            <option>Domingo</option>
                            </FormSelect>
                        </Form>
                    </Col>
                    <Col>
                        <Button className= "btn-rutinas" onClick={handleShowAdd}>
                            Crear rutina
                        </Button>
                    </Col>
                </Row>
            </Container>
            <br />
            <div  style={{marginLeft: '55px'}}>
            <Card style={{width: '92%'}}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Repeticiones</th>
                        <th>Series</th>
                        <th>Nota</th>
                        <th>
                    </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>1</td>
                        <td>Ejericio 1</td>
                        <td>16</td>
                        <td>4</td>
                        <td>Nota ejemplo</td>
                        <td style={{textAlign:'center'}}> <Button className= "btn-rutinas-eliminar" >Eliminar</Button></td>
                        </tr>   
                    </tbody>
            </Table>
        </Card>
    </div>
</div>
  );
};

export default TablaRutinas;