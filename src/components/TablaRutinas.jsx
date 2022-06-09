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
import {useState, useEffect} from 'react';
import { getAllActiveUsers, crearRutinasUsuario, getRoutines, getTrainings } from '../utils/client';
import InputSelector from '../components/InputSelector';

const TablaRutinas = () => {
    const [showAdd, setShowFalse] = useState(false);
    const [user, setUsername] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState("Buscar Socio");
    const [searchResults, setSearchResults] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [selectedRoutine, setSelectedRotuine] = useState(null);
    const [trainings, setTrainings] = useState([])
    const handleCloseAdd = () => setShowFalse(false);
    const handleShowAdd = () => setShowFalse(true);

    /*Get all active users*/
    useEffect(() =>{
        getAllActiveUsers().then( response => {
            const data = [];
            response.forEach(i => {
                data.push({id: i.id, username: i.get('username')});
            });
            setSearchResults(data);
        });
    }, [])

    useEffect(() =>{
        crearRutinasUsuario(selectedUser);

        getRoutines(selectedUser)
        .then(data => setRoutines(data));
    }, [selectedUser])

    useEffect(() =>{
        getTrainings(selectedRoutine)
        .then(data => setTrainings(data));
    }, [selectedRoutine])

    const filterUsers = (i) => {
        if(user === ""){
            return false;
        }else{
            return i.username.toLowerCase().includes(user.toLowerCase());
        }    
    }

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
                            <Form.Control  placeholder="Nombre del ejericio" required/></Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                            <Form.Label> <h6>Repeticiones</h6></Form.Label>
                            <Form.Control  placeholder="No. de Repeticiones" required/></Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                            <Form.Label> <h6>Series</h6></Form.Label>
                            <Form.Control  placeholder="No. de Series" required/></Form.Group>
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
                        <InputSelector
                        className="input-selector-rutinas"
                        getDisplayText={i => i.username}
                        getElementId={i => i.objectId}
                        placeholder='Nombre del socio'
                        onChange={(text) => setUsername(text)}
                        getListData={async () => {
                            const response = await getAllActiveUsers();
                            const data = [];
                            response.forEach(i => {
                                console.log(i);
                                data.push({objectId: i.id, username: i.get('username'), tableName: 'User'});
                            });
                            return data;
                        }}
                        />
                        {/* <Form className="d-flex">
                            <input 
                                className="me-2"
                                type="text"
                                placeholder={selectedUserName}
                                value={user}
                                onChange={(text) => setUsername(text.target.value)}
                            />
                            <Button variant="outline-success">Buscar</Button>
                        </Form> */}
                        {/* <div>
                            {searchResults.filter(i => filterUsers(i)).map(item => {
                                return(
                                    <div key={item.id} onClick={() => {setSelectedUser(item.id); setSelectedUserName(item.username)}}>
                                    <p>{item.username}</p>
                                    </div>
                                )
                            })}
                        </div> */}
                    </Col>
                    <Col>
                        <Form>
                            <FormSelect id="roleSelection" onChange={event => setSelectedRotuine(event.target.value)}>
                                <option value="none" selected disabled hidden>Seleccione un dia</option>
                            {routines.map(item => {
                                return(
                                    <option key={item.id} value={item.id}>{item.get('titulo')}</option>
                                )
                            })

                            }
                            </FormSelect>
                        </Form>
                    </Col>
                    <Col>
                        <Button className= "btn-rutinas" onClick={handleShowAdd}>
                            Agregar ejercicio
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
                        {trainings.map((item, index) => {
                            return(
                                <tr key={item.id}>
                                <td>{index}</td>
                                <td>{item.get('nombre')}</td>
                                <td>{item.get('repeticiones')}</td>
                                <td>{item.get('series')}</td>
                                <td>{item.get('notas')}</td>
                                <td style={{textAlign:'center'}}> <Button className= "btn-rutinas-eliminar" >Eliminar</Button></td>
                                </tr>  
                            )
                        })}  
                    </tbody>
            </Table>
        </Card>
    </div>
</div>
  );
};

export default TablaRutinas;