import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form'


const TablaAdmins = () => {
    return (
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>A002</td>
          <td>
          <Form.Select >
            <option>Large select</option>
          </Form.Select>
          </td>
        </tr>
        <tr>
          <td>A003</td>
          <td>PEREZ GOMEZ JUAN</td>
        </tr>

      </tbody>
    </Table>

    )
}
  
  export default TablaAdmins