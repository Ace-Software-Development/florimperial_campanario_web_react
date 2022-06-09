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
            <Modal.Body>
                Modal prueba
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-publicar" onClick={handleCloseAdd}>
                Cerrar
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
                            Agregar ejericio
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
                        <td> <Button className= "btn-rutinas">Modificar</Button></td>
                        </tr>   
                    </tbody>
            </Table>
        </Card>
    </div>
</div>
  );
};

export default TablaRutinas;