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
import {createMember, checkUser} from '../utils/client';
import {useHistory, useParams} from 'react-router-dom';
import Papa from 'papaparse';
import Screen from '../components/Screen';
import ReservationCard from '../components/ReservationCards';

export default function ReservacionesSocio() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState('none');
  const [permissions, setPermissions] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showHelp, setShowHelp] = useState(false);
  const handleCloseHelp = () => setShowHelp(false);
  const handleShowHelp = () => setShowHelp(true);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [statusReport, setStatusReport] = useState(new Array());
  const [showReport, setShowReport] = useState('none');
  let {socioId} = useParams();
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
      setPermissions(permissionsJson);
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
    <Screen permissions={permissions} title="Resevaciones del socio">
      <div className="App">
        <Container>
          aaaaaaaaaaaaaaaaaa {socioId}
          {/* <ReservationCard props={props} */}
        </Container>
      </div>
    </Screen>
  );
}
