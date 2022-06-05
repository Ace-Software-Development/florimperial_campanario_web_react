import '../css/GestionSocios.css';
import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Container from 'react-bootstrap/Container';
import {useEffect, useState} from 'react';
import CirculoCarga from '../components/CirculoCarga';
import {checkUser, getArea, getReservations} from '../utils/client';
import {useHistory, useParams} from 'react-router-dom';
import Header from '../components/Header';
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

  useEffect(() => {
    const data = new Map();
    getArea().then(data => setallAreas(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    getReservations(socioId).then(data => setReservations(data));
    setLoading(false);
  }, [reservationMade]);

  if (loading)
    return (
      <span>
        <CirculoCarga />
      </span>
    );

  if (reservations.length === 0) {
    return (
      <div className="App">
        <Header processName="Reservaciones del socio" />
        <Container>El socio no cuenta con reservaciones.</Container>
      </div>
    );
  }

  return (
    <div className="App d-flex flex-column align-items-center">
      <Header processName="Reservaciones del socio" />

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
    </div>
  );
}
