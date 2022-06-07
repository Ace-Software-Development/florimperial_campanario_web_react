import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {useEffect, useState} from 'react';
import CirculoCarga from '../components/CirculoCarga';
import {checkUser, getCuenta, getMembers} from '../utils/client';
import {useHistory} from 'react-router-dom';
import Screen from '../components/Screen';
import Parse from 'parse';
import ParseObject from 'parse/lib/browser/ParseObject';
import Card from 'react-bootstrap/Card';
import TablaSocios from '../components/TablaSocios';

export default function ListaSocios() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});
  const [cuentas, setCuentas] = useState([]);
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

      //      getCuenta().then(cuenta => {
      getMembers().then(cuenta => {
        setCuentas(cuenta);
        setLoading(false);
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
    <Screen permissions={permissions} title="Lista de socios">
      <div className="App">
        <div style={{marginLeft: '145px'}}>
          <Card style={{width: '90%'}}>
            <TablaSocios props={cuentas} />
          </Card>
        </div>
      </div>
    </Screen>
  );
}
