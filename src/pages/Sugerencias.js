import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {useEffect, useState} from 'react';
import CirculoCarga from '../components/CirculoCarga';
import {
  checkUser,
  getAdminUsers,
  getRolesNames,
  getAdminRole,
  getSugerencias,
} from '../utils/client';
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
import SugerenciaCard from '../components/SugerenciaCard';

export default function ListaSocios() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});
  const [sugerencias, setSugerencias] = useState(new ParseObject());

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

      getSugerencias().then(sugerencias => {
        setSugerencias(sugerencias);
        console.log(sugerencias);
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
  const listItems = sugerencias.map(sugerencia => (
    <Col> 
      <SugerenciaCard props={sugerencia} />
    </Col>
));

  return (
    <Screen permissions={permissions} title="Sugerencias">
      <Container>
        <Row xs={1} s={2} md={3} className="g-4">
        {listItems}
        </Row>
      </Container>
    </Screen>
  );
}
