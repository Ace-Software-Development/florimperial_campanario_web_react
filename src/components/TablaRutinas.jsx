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
import Parse from 'parse';
import {useState, useEffect} from 'react';
import InputSelector from '../components/InputSelector';
import { getAllActiveUsers, crearRutinasUsuario, getRoutines, getTrainings, saveExcercise, deleteExcersize } from '../utils/client';

const TablaRutinas = () => {
    const [showAdd, setShowFalse] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [selectedRoutine, setSelectedRotuine] = useState(null);
    const [trainings, setTrainings] = useState([]);
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
        if(selectedUser !== null){
            crearRutinasUsuario(selectedUser.objectId).then(function() {
                getRoutines(selectedUser.objectId)
                .then(data => setRoutines(data));
            })
        }
        setSelectedRotuine(null);   
    }, [selectedUser])

    useEffect(() =>{
        getTrainings(selectedRoutine)
        .then(data => setTrainings(data));
    }, [selectedRoutine])
    
    const createExcercise = async event => {
        event.preventDefault();
        event.stopPropagation();

        const newExcerciseForm = event.currentTarget;
        const name = newExcerciseForm.newExcerciseName.value;
        const repetitions = Number(newExcerciseForm.newExcerciseRepetitions.value);
        const series = Number(newExcerciseForm.newExcerciseSeries.value);
        const notes = newExcerciseForm.newExcerciseNotes.value;

        try {
            saveExcercise(selectedRoutine, name, repetitions, series, notes).then(function() {
                getTrainings(selectedRoutine).then(data => {
                    setTrainings(data);
                    handleCloseAdd();
                });
            });
        } catch (error) {
            alert(`Ha ocurrido un error.`);
            handleCloseAdd();
        }    
    }

    const deleteTraining = (excersizeId) => {
        deleteExcersize(excersizeId).then(function() {
            getTrainings(selectedRoutine)
            .then(data => setTrainings(data));
        });
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
                    <Form id="formCreateExcercise" onSubmit={createExcercise}>
                        <Row>
                            <Col xs={7}>
                                <Form.Group className="mb-3">
                                    <Form.Label> <h6>Nombre</h6></Form.Label>
                                    <Form.Control id="newExcerciseName" placeholder="Nombre del ejericio" type="text" maxLength={32} required/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label> <h6>Repeticiones</h6></Form.Label>
                                    <Form.Control id="newExcerciseRepetitions" placeholder="No. de Repeticiones" type="number" min="0" max="500"/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label> <h6>Series</h6></Form.Label>
                                    <Form.Control id="newExcerciseSeries" placeholder="No. de Series" type="number" min="0" max="500"/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3">
                                <Form.Label> <h6>Notas</h6></Form.Label>
                                <Form.Control id="newExcerciseNotes" placeholder="Notas adicionales" type="text" maxLength={512} as="textarea" rows={3} />
                            </Form.Group>
                        </Row>
                    </Form>
                </Container>
            </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-publicar" onClick={handleCloseAdd}>Cancelar</Button>
                    <Button type="submit" className="btn-publicar" form="formCreateExcercise">Crear</Button>
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
                        onChange={(text) => setSelectedUser(text)}
                        getListData={async () => {
                            const response = await getAllActiveUsers();
                            const data = [];
                            response.forEach(i => {
                                data.push({objectId: i.id, username: i.get('username'), tableName: 'User'});
                            });
                            return data;
                        }}
                        />
                    </Col>
                    <Col>
                        <Form>
                            <FormSelect id="roleSelection" onChange={event => setSelectedRotuine(event.target.value)}>
                                <option value="null" selected>Seleccione un día</option>
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
                    {selectedRoutine !== null && selectedRoutine !== "null" ?
                        <Button className= "btn-rutinas" onClick={handleShowAdd}>
                            Agregar ejercicio
                        </Button>
                    :
                        null
                    } 
                    </Col>
                </Row>
            </Container>
            <br />
            <div  style={{marginLeft: '7rem'}}>
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
                        {trainings.length === 0 ?
                            <tr>No hay ejercicios disponibles, favor de agregar nuevos.</tr>
                            :
                            null
                        }
                        {trainings.map((item, index) => {
                            return(
                                <tr key={item.id}>
                                <td>{index+1}</td>
                                <td>{item.get('nombre')}</td>
                                <td>{item.get('repeticiones')}</td>
                                <td>{item.get('series')}</td>
                                <td>{item.get('notas')}</td>
                                <td style={{textAlign:'center'}}> <Button className= "btn-rutinas-eliminar" onClick={() => deleteTraining(item.id)}>Eliminar</Button></td>
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