import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import {useState} from 'react';
import {setPasesSocio} from '../utils/client';

const TablaAdmins = props => {
  const [newNumber, setNumber] = useState('');

  /**
   * handleChangeRole
   * @description It takes the role selected and assigns it to the chosen user
   * @param event: contains the form with the information of the user and role
   */
  const handleChangeNumber = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    const idCuenta = form.id;
    const nuevoNumero = form.nuevoNum.value;

    setPasesSocio(idCuenta, parseInt(nuevoNumero)).then(() => {
      alert('Se actualizó exitosamente la cantidad de pases.');
      window.location.reload();
    });
  };
  const tableElements = props.props.map(socio => (
    <tr>
      <td>{socio.attributes.noAccion}</td>
      <td>
        <Container>
          <Row>
            <Col s={10} m={10}>
              <form id={socio.id} onSubmit={handleChangeNumber}>
                <div class="form-outline">
                  <input
                    type="number"
                    id="nuevoNum"
                    className="form-control"
                    defaultValue={socio.attributes.pases}
                    onChange={e => setNumber(e.target.value)}
                  />
                </div>
              </form>
            </Col>
            <Col className="col-2">
              <Button type="submit" form={socio.id}>
                Guardar
              </Button>
            </Col>
          </Row>
        </Container>
      </td>
    </tr>
  ));
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo electrónico</th>
          <th>Número de acceso</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Usuario Placeholder 1</td>
          <td>correo@ejemplo.com</td>
          <td>0176</td>
          <td>Activo</td>
        </tr>
        <tr>
          <td>Usuario Placeholder 2</td>
          <td>correo@ejemplo.com</td>
          <td>0177</td>
          <td>Inactivo</td>
        </tr>
      </tbody>
    </Table>
  );
};
export default TablaAdmins;
