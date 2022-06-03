import "../css/GestionSocios.css";
import React from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import TablaCsvEjemplo from "../components/TablaCsvEjemplo";
import { useEffect, useState } from "react";
import CirculoCarga from "../components/CirculoCarga";
import { createMember, checkUser } from "../utils/client";
import { useHistory } from "react-router-dom";
import Papa from "papaparse";
import Screen from "../components/Screen";

export default function GestionSocios() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState("none");
  const [permissions, setPermissions] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showHelp, setShowHelp] = useState(false);
  const handleCloseHelp = () => setShowHelp(false);
  const handleShowHelp = () => setShowHelp(true);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [statusReport, setStatusReport] = useState(new Array());
  const [showReport, setShowReport] = useState("none");

  useEffect(async () => {
    const permissionsJson = await checkUser();
    if (permissionsJson === "NO_USER") {
      alert("Necesitas haber ingresado al sistema para consultar esta página.");
      history.push("/");
    } else if (permissionsJson === "NOT_ADMIN") {
      alert("Necesitas ser administrador para acceder al sistema.");
      history.push("/");
    } else if (permissionsJson === "INVALID_SESSION") {
      alert("Tu sesión ha finalizado. Por favor, inicia sesión nuevamente.");
      history.push("/");
    }
    if (permissionsJson.Gestion === false) {
      alert(
        "No tienes acceso a esta página. Para más ayuda contacta con tu administrador."
      );
      history.push("/home");
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

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    if (event.target.files[0]) {
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          setCsvData(results.data);
        },
      });
    }
  };
  function CsvForm() {
    const report = [];
    const handleSubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
      } else {
        setUploading("");
        try {
          setUploading("");
          for (let i = 0; i < csvData.length; i++) {
            const newMemberStatus = await createMember(
              csvData[i]["E-MAIL"],
              csvData[i]["SOCIO"],
              csvData[i]["SOCIO"]
            );
            if (newMemberStatus == "ok") {
              report.push(
                `Se registró exitosamente el socio con email ${csvData[i]["E-MAIL"]} y num. de acción ${csvData[i]["SOCIO"]}  `
              );
            } else {
              report.push(
                `Hubo un error al registrar al socio con email ${csvData[i]["E-MAIL"]} y num. de acción ${csvData[i]["SOCIO"]}: ${newMemberStatus}  `
              );
            }
          }
          setValidated(true);
        } catch (e) {
          setValidated(true);
          setUploading("none");
          setShowReport("");
        }
        setStatusReport(report);
        setShowReport("");
        setUploading("none");
      }
    };

    return (
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        id="uploadCsv"
      >
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label>Sube aquí el archivo csv</Form.Label>
            <Form.Control
              type="file"
              id="csvForm"
              accept=".csv"
              onChange={changeHandler}
              required
            />
            <Form.Control.Feedback type="invalid">
              Por favor sube aquí el archivo CSV con la información de los
              socios.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
      </Form>
    );
  }
  const csvForm = CsvForm();

  if (loading)
    return (
      <span>
        <CirculoCarga />
      </span>
    );
  const reportList = statusReport.map((member) => (
    <Row>
      <li> {member} </li>
    </Row>
  ));

  return (
    <Screen permissions={permissions} title="none">
      <div className="App">
        <div onClick={(e) => e.stopPropagation()}>
          <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Registrar socios en el sistema</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{ display: `${uploading}` }}>
                <CirculoCarga />
              </div>

              {csvForm}
              <div style={{ display: `${showReport}` }}>
                Reporte de carga de usuarios:
                {reportList}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-campanario" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                form="uploadCsv"
                className="btn-publicar"
                disabled={buttonDisabled}
              >
                Registrar socios
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Modal size="lg" show={showHelp} onHide={handleCloseHelp}>
            <Modal.Header closeButton>
              <Modal.Title>Ayuda</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Para realizar la carga de usuarios, se debe ingresar al sistema un
              archivo .csv con el siguiente formato:
              <TablaCsvEjemplo />
              Se generará una cuenta para cada socio y se registrarán los
              números de acción que aún no están en el sistema La contraseña por
              defalut para el socio será su número de acción.
              <br />
              <br />
              Es importante solicitarle al socio que cambie su contraseña a la
              brevedad posible.
              <br />
              <br />
              Posteriormente al registro de los números de acción, podrá
              gestionar el número de pases disponibles desde el panel de gestión
              de socios.
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-publicar" onClick={handleCloseHelp}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <header className="app-header">
          <h1 className="spacing">
            Gestión de Socios
            <button
              type="button"
              className="btn-information"
              onClick={handleShowHelp}
            >
              <ion-icon
                name="information-circle-outline"
                style={{ fontSize: ".5em" }}
              ></ion-icon>
            </button>
          </h1>
        </header>
        <Container>
          <Row xs={1} s={2} md={3} className="g-5">
            <Col>
              <Card
                onClick={handleShow}
                style={{ width: "82rem" }}
                className="card-imgs cargar-datos top-50 start-50 translate-middle "
              >
                <Card.Title className="text-center card-title">
                  <br /> Cargar datos
                </Card.Title>
                <div className="d-flex">
                  <ion-icon
                    className="plus-icon-gestion"
                    name="add-circle-outline"
                    class="icon-plus"
                  ></ion-icon>
                </div>
                <a href="#" class="stretched-link"></a>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </Screen>
  );
}
