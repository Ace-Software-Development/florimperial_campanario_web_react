import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import {useState} from 'react';
import {setPasesSocio} from '../utils/client';
import '../css/PerfilSocios.css';
const TablaAdmins = props => {
  const [newNumber, setNumber] = useState('');
  console.log(props.props);

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
      <td>{socio.attributes.username}</td>
      <td>{socio.attributes.account.get('noAccion')}</td>
      <td>
        <Container>
          <Row>
            <Col s={10} m={10}>
              <form id={socio.attributes.account.id} onSubmit={handleChangeNumber}>
                <div class="form-outline">
                  <input
                    type="number"
                    id="nuevoNum"
                    className="form-control"
                    defaultValue={socio.attributes.account.get('pases')}
                    onChange={e => setNumber(e.target.value)}
                  />
                </div>
              </form>
            </Col>
            <Col className="col-2">
              <Button type="submit" className="btn-guardar" form={socio.attributes.account.id}>
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
          <th>Socio</th>
          <th>Número de acción</th>
          <th>Cantidad de Pases</th>
        </tr>
      </thead>
      <tbody>{tableElements}</tbody>
    </Table>
  );
};
export default TablaAdmins;
