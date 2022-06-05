import '../css/GestionSocios.css';
import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Container from 'react-bootstrap/Container';
import {useEffect, useState} from 'react';
import CirculoCarga from '../components/CirculoCarga';
import {checkUser, getArea, getReservations} from '../utils/client';
import {useHistory, useParams} from 'react-router-dom';
import Screen from '../components/Screen';
import ReservationCard from '../components/ReservationCards';
import {getMonthFormat} from '../utils/timeHelpers';
import {createContext, useContext} from 'react';

export default function ReservacionesSocio() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});
  const [areas, setallAreas] = useState([]);
  const [reservations, setReservations] = useState([]);
  const reservationMadeContext = createContext(false);
  const {reservationMade, setReservationMade} = useContext(reservationMadeContext);

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

  useEffect(() => {
    const data = new Map();
    getArea().then(data => setallAreas(data));
  }, []);

  useEffect(() => {
    getReservations(socioId).then(data => setReservations(data));
  }, [reservationMade]);

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
          {reservations.map((reservation, i) => {
            return (
              <ReservationCard
                key={i}
                area={areas.get(reservation.get('sitio').get('area').id)}
                sitio={reservation.get('sitio').get('nombre')}
                hour={reservation
                  .get('fechaInicio')
                  .toISOString()
                  .slice(11, 16)}
                month={getMonthFormat(reservation.get('fechaInicio'))}
                day={reservation.get('fechaInicio').getDate()}
              />
            );
          })}
        </Container>
      </div>
    </Screen>
  );
}
