import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Parse from 'parse/lib/browser/Parse';
import {FormControl} from 'react-bootstrap';
import {setSupportNumber} from '../utils/client';
import {useEffect, useState} from 'react';

const TablaNumeros = supportNumbers => {
  const [newNumber, setNumber] = useState('');
  const [username, setUsername] = useState('');

  /**
   * handleChangeRole
   * @description It takes the role selected and assigns it to the chosen user
   * @param event: contains the form with the information of the user and role
   */
  const handleChangeNumber = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    const idNumero = form.id;
    const nuevoNumero = form.nuevoNum.value;

    setSupportNumber(idNumero, parseInt(nuevoNumero)).then(() => {
      alert('Se actualizó exitosamente el número.');
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
              <form id={number.id} onSubmit={handleChangeNumber}>
                <div class="form-outline">
                  <input
                    type="number"
                    id="nuevoNum"
                    className="form-control"
                    defaultValue={number.attributes.Numero}
                    onChange={e => setNumber(e.target.value)}
                  />
                </div>
              </form>
            </Col>
            <Col className="col-2">
              <Button type="submit" form={number.id}>
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
