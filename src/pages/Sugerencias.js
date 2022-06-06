import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {useEffect, useState} from 'react';
import CirculoCarga from '../components/CirculoCarga';
import {checkUser, getAdminUsers, getRolesNames, getAdminRole} from '../utils/client';
import {useHistory} from 'react-router-dom';
import Screen from '../components/Screen';
import Parse from 'parse';
import ParseObject from 'parse/lib/browser/ParseObject';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import '../css/Sugerencias.css';
import Button from 'react-bootstrap/Button';

export default function ListaSocios() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});
  const [currentRole, setRole] = useState(new ParseObject());
  const [currentUser, setCurrentUser] = useState(new Parse.User());
  const [showFull, setShowFalse] = useState(false);
  const handleCloseFull = () => setShowFalse(false);
  const handleShowFull = () => setShowFalse(true);


  useEffect(async () => {
    const permissionsJson = await checkUser();
    if (permissionsJson === 'NO_USER') {
      alert('Necesitas haber ingresado al sistema para consultar esta página.');
      history.push('/');
    } else if (permissionsJson === 'NOT_ADMIN') {
      alert('Necesitas ser administrador para acceder al sistema.');
      history.push('/');
    } else if (permissionsJson === 'INVALID_SESSION') {
      alert('Tu sesión ha finalizado. Por favor, inicia sesión nuevamente.');
      history.push('/');
    }
    setPermissions(permissionsJson);

    try {
      setLoading(true);
      const permissionsJson = await checkUser();
      setPermissions(permissionsJson);
      // const user = await Parse.User.current();
      Parse.User.currentAsync().then(user => {
        console.log(user);
        setCurrentUser(user);
        getAdminRole(user.id).then(roleObj => {
          setRole(roleObj);
          setLoading(false);
        });
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  if (loading)
    return (
      <span>
        <CirculoCarga />
      </span>
    );

    

  return (
      
    <Screen permissions={permissions} title="Sugerencias">
        <div onClick={e => e.stopPropagation()}>
          <Modal size="lg" show={showFull} onHide={handleCloseFull}>
            <Modal.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna 
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis 
                aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                non proident, sunt in culpa qui officia deserunt mollit anim id 
                est laborum.
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-publicar" onClick={handleCloseFull}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <Container>
          <Row xs={1} s={2} md={3} className="g-4">
            <Col>
              <Card className= "card-sugerencias" onClick={handleShowFull}>
                   <Card.Text>
                       <div className= "card-sugerencias-contenido">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                            sed do eiusmod tempor incididunt ut labore et dolore magna 
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis 
                            aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                            non proident, sunt in culpa qui officia deserunt mollit anim id 
                            est laborum.
                       </div>
                    </Card.Text>
                    <Card.Footer>
                        <div className="d-flex">
                            <button className= "btn-eliminar-sugerencia"><ion-icon name="trash-outline"style={{fontSize: '1.25em'}}></ion-icon></button>
                        </div>
                    </Card.Footer>   
                <a href="#" class="stretched-link"></a>
              </Card>
            </Col>
          </Row>
        </Container>

    </Screen>
  );
}