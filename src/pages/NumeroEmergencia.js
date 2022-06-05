import '../css/GestionSocios.css';
import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import TablaCsvEjemplo from '../components/TablaCsvEjemplo';
import {useEffect, useState} from 'react';
import CirculoCarga from '../components/CirculoCarga';
import {createMember, checkUser, getSupportNumbers} from '../utils/client';
import {useHistory} from 'react-router-dom';
import Papa from 'papaparse';
import Screen from '../components/Screen';
import TablaNumeros from '../components/TablaNumeros';

export default function NumeroEmergencia() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});
  const [supportNumbers, setSupportNumbers] = useState([]);

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
    if (permissionsJson.Gestion === false) {
      alert('No tienes acceso a esta página. Para más ayuda contacta con tu administrador.');
      history.push('/home');
    }
    setPermissions(permissionsJson);
    try {
      setLoading(true);
      const permissionsJson = await checkUser();
      const numbers = await getSupportNumbers();
      setPermissions(permissionsJson);
      setSupportNumbers(numbers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <span>
        <CirculoCarga />
      </span>
    );

  return (
    <Screen permissions={permissions} title="Número de emergencias">
      {console.log(supportNumbers)}
      <div className="App">
        <TablaNumeros supportNumbers={supportNumbers} />
      </div>
    </Screen>
  );
}
