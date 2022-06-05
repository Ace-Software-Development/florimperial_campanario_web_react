import {Card} from 'react-bootstrap';

export default function ReservationCard(props) {
  <Card>
    <Card.Body>
      <Card.Text>{props.area}</Card.Text>
      <Card.Text>{props.sitio}</Card.Text>
      <Card.Text>Hora</Card.Text>
      <Card.Text>{props.hour} Hrs</Card.Text>
    </Card.Body>
    <Card.Footer>
      <Card.Text>{props.month}</Card.Text>
      <Card.Text>{props.day}</Card.Text>
    </Card.Footer>
  </Card>;
}
