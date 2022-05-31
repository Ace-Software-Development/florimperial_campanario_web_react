import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form'
import { getAdminUsers } from "../utils/client";
import Parse from "parse/lib/browser/Parse";

const TablaAdmins = (adminList) => {

  for (let i = 0; i < adminList.adminList.length; i++){

  }

    return (
      <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
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