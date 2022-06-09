import '../css/PerfilSocios.css';
import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {useEffect, useState} from 'react';
import CirculoCarga from '../components/CirculoCarga';
import {checkUser, getAdminUsers, getRolesNames, getAdminRole} from '../utils/client';
import {useHistory} from 'react-router-dom';
import Screen from '../components/Screen';
import Parse from 'parse';
import ParseObject from 'parse/lib/browser/ParseObject';
import InfoSocio from '../components/InfoSocio';

export default function PerilSocio() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});
  const [currentRole, setRole] = useState(new ParseObject());
  const [currentUser, setCurrentUser] = useState(new Parse.User());
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
    <Screen permissions={permissions} title="Perfil de socio">
      <div className="App">
        <div style={{marginLeft: '15px'}}>
          <InfoSocio/>
          <br />
        </div>
      </div>
    </Screen>
  );
}
