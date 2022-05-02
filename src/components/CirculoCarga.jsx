import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";


const CirculoCarga = () => {
    return (
        <Row className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">  Cargando...</span>
        </Spinner>
      </Row>
    )
}
  
  export default CirculoCarga