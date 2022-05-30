import Table from "react-bootstrap/Table";



const TablaCsvEjemplo = () => {
    return (
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>SOCIO</th>
          <th>NOMBRE</th>
          <th>E-MAIL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>A002</td>
          <td>ESTRADA GOMEZ PEDRO</td>
          <td>a@a.com</td>
        </tr>
        <tr>
          <td>A003</td>
          <td>PEREZ GOMEZ JUAN</td>
          <td>b@b.com</td>
        </tr>

      </tbody>
    </Table>

    )
}
  
  export default TablaCsvEjemplo