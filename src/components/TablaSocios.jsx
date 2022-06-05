import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import {FormSelect} from 'react-bootstrap';

const TablaAdmins = () => {
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