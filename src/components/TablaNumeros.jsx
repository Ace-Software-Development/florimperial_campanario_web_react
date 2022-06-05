import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Parse from 'parse/lib/browser/Parse';
import {FormControl} from 'react-bootstrap';
import {setAdminRole} from '../utils/client';

const TablaNumeros = supportNumbers => {
  /**
   * handleChangeRole
   * @description It takes the role selected and assigns it to the chosen user
   * @param event: contains the form with the information of the user and role
   */
  const handleChangeRole = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    const idAdmin = form.id;
    const idRol = form.roleSelection.value;
    setAdminRole(idAdmin, idRol).then(() => {
      alert('Se cambió exitosamente el rol del administrador');
      window.location.reload();
    });
  };

  const tableElements = supportNumbers.supportNumbers.map(number => (
    <tr>
      <td>{number.attributes.Categoria}</td>
      <td>
        <Container>
          <Row>
            <Col s={10} m={10}>
              <Form id={number.id} onSubmit={handleChangeRole}>
                <Form.Control type="text" id="inputPassword5" value={number.attributes.Numero} />
              </Form>
            </Col>
            <Col className="col-2">
              <Button type="submit" form="a">
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
          <th>Categoría</th>
          <th>Número</th>
        </tr>
      </thead>
      <tbody>{tableElements}</tbody>
    </Table>
  );
};
export default TablaNumeros;
