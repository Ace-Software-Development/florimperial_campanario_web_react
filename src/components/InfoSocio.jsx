//W15 Y W16

import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import '../css/Dashboard.css';
import Card from 'react-bootstrap/Card';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import {useState} from 'react';
import {setPasesSocio} from '../utils/client';
import '../css/PerfilSocios.css';
function InfoSocio(props) {
  const [newNumber, setNumber] = useState('');
  const [showFull, setShowFalse] = useState(false);
  const handleCloseFull = () => setShowFalse(false);
  const handleShowFull = () => setShowFalse(true);

  /**
   * handleChangeNumber
   * @description It takes the number of passes and assigns it to the chosen user
   * @param event: contains the form with the information of the user and role
   */
  const handleChangeNumber = async event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    const idCuenta = form.id;
    const nuevoNumero = form.nuevoNum.value;

    const result = await setPasesSocio(idCuenta, parseInt(nuevoNumero));
    if (result === 0) {
      console.log(result);
      alert('Se actualizó exitosamente la cantidad de pases.');

      window.location.reload();
    }
  };
  return (
    <Card className="profile-card">
      <Container className="profile-container">
        <Row>
          <Col sm>
            <ion-icon name="person-circle-outline" style={{fontSize: '10em'}}></ion-icon>
          </Col>
          <Col sm>
            <h6>Usuario:</h6> {props.socio.attributes.username} <br /> <br />
            <h6>Pases:</h6>
            <form id={props.socio.attributes.account.id} onSubmit={handleChangeNumber}>
              <div class="form-outline">
                <input
                  type="number"
                  id="nuevoNum"
                  className="form-control"
                  defaultValue={props.socio.attributes.account.get('pases')}
                  onChange={e => setNumber(e.target.value)}
                />
              </div>
            </form>
          </Col>
          <Col sm>
            <h6>Numero de socio:</h6> {props.socio.attributes.account.get('noAccion')}
            <br /> <br /> <br />{' '}
            <Button type="submit" className="btn-guardar" form={props.socio.attributes.account.id}>
              Guardar
            </Button>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

export default InfoSocio;
