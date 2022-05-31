import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form'
import Parse from "parse/lib/browser/Parse";

const TablaAdmins = (adminList, roleNames) => {
  const adminRowsArray = [];
  for (let i = 0; i < adminList.adminList.length; i++){
    adminRowsArray.push({admin: adminList.adminList[i].attributes.Admin, rol: adminList.adminList[i].attributes.rol, username:adminList.adminList[i].attributes.username  }); 
  }
  console.log("roles:", roleNames);
/*  const roleOptions = roleNames.roleNames.map((role) => (
    <Form.Select >
      <option>{role.attributes.NombreRol}</option>
    </Form.Select>
  ));*/


  const tableElements = adminRowsArray.map((row) => (
    <tr>
          <td>{row.username}</td>
          <td>
          </td>
        </tr>
  ));

    return (
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody>
        {tableElements}
      

      </tbody>
    </Table>

    )
}
  
  export default TablaAdmins