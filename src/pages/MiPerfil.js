import '../css/MiPerfil.css';
import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {useEffect, useState} from 'react';
import CirculoCarga from '../components/CirculoCarga';
import {checkUser, getAdminUsers, getRolesNames, getAdminRole} from '../utils/client';
import {useHistory} from 'react-router-dom';
import Screen from '../components/Screen';
import Card from 'react-bootstrap/card';
import Parse from 'parse';
import ParseObject from 'parse/lib/browser/ParseObject';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function MiPerfil() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});
  const [currentRole, setRole] = useState(new ParseObject());
  const [currentUser, setCurrentUser] = useState(new ParseObject());
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
      const user = await Parse.User.currentAsync();
      console.log(user);
      const roleObj = await getAdminRole(user.id);
      console.log(roleObj);
      setRole(roleObj).then(() => {
        setCurrentUser(user).then(() => {
          console.log(currentRole, currentUser);
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
    <Screen permissions={permissions} title="Mi perfil">
      <div className="App">
        <div style={{marginLeft: '15px'}}>
         <Card className="profile-card">
            <Container className= "profile-container">
              <Row xs={2} md={4} lg={6}>
                <Col sm><ion-icon name="person-circle-outline" style={{fontSize: '10em'}}></ion-icon></Col>
                <Col sm><h6>Usuario:</h6> El que no debe ser nombrado{currentUser.id} <br/><br/><h6>Rol actual:</h6>{currentRole.id}</Col>
                <Col sm><h6>Correo electrónico:</h6> correo@ejemplo.com <br/><br/><h6>Numero de nómina:</h6>123456789</Col> 
              </Row>
            </Container>
            </Card>
            <br />
        </div>
      </div>
    </Screen>
  );
}
