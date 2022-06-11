//W15 Y W16

import Table from 'react-bootstrap/Table';
import FilaSocio from './FilaSocio';
import {useState} from 'react';
import {setPasesSocio} from '../utils/client';
import '../css/PerfilSocios.css';
const TablaAdmins = props => {
  const [newNumber, setNumber] = useState('');
  const [showFull, setShowFalse] = useState(false);

  console.log(props.props);

  /**
   * handleChangeNumber
   * @description It takes the number of passes and assigns it to the chosen user
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
  const tableElements = props.props.map(socio => <FilaSocio socio={socio} />);
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Socio</th>
            <th>Número de acción</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>{tableElements}</tbody>
      </Table>
    </div>
  );
};
export default TablaAdmins;
