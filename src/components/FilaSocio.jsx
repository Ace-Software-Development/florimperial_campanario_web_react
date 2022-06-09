//W15 Y W16
import InfoSocio from './InfoSocio';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import {useState} from 'react';
import {setPasesSocio} from '../utils/client';
import '../css/PerfilSocios.css';
const FilaSocio = props => {
  const [newNumber, setNumber] = useState('');
  const [showFull, setShowFalse] = useState(false);
  const handleCloseFull = () => setShowFalse(false);
  const handleShowFull = () => setShowFalse(true);

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
      console.log(idCuenta, nuevoNumero);
      alert('Se actualizó exitosamente la cantidad de pases.');
      window.location.reload();
    });
  };

  return (
    <tr>
      <td>
        <div onClick={e => e.stopPropagation()}>
          <Modal size="lg" show={showFull} onHide={handleCloseFull}>
            <Modal.Header>
              <h4>Detalles del socio</h4>
            </Modal.Header>
            <Modal.Body>
              <InfoSocio socio={props.socio} />
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-guardar " onClick={handleCloseFull}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        {props.socio.attributes.username}
      </td>
      <td>{props.socio.attributes.account.get('noAccion')}</td>
      <td>
        <Button className="btn-guardar" onClick={handleShowFull}>
          Ver detalles
        </Button>
      </td>
    </tr>
  );
};
export default FilaSocio;
