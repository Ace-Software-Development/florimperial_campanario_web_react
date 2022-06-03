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
        <div style={{marginLeft: '145px'}}>
          <Card>
            Usuario
            {currentUser.id}
            <br />
            {currentRole.id}
            <ion-icon name="person-circle-outline"></ion-icon>
          </Card>
        </div>
      </div>
    </Screen>
  );
}
