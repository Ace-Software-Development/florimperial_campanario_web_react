import {Card} from 'react-bootstrap';

export default function ReservationCard(props) {
  return (
    <Card border="primary" style={{width: '15rem'}} className="reservaciones-socio-card">
      <Card.Header>
        <Card.Title>Reservación</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <h5> {props.area}</h5>
          <ul>
            <li>Sitio: {props.sitio}</li>
            <li>Hora: {props.hour} Hrs</li>
          </ul>
          Reservado para el día {props.day} de {props.month}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
