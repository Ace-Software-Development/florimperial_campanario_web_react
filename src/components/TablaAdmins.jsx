import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form'
import  Button  from "react-bootstrap/Button";
import  Row  from "react-bootstrap/Row";
import  Container  from "react-bootstrap/Container";
import  Col  from "react-bootstrap/Col";
import Parse from "parse/lib/browser/Parse";
import { FormSelect } from "react-bootstrap";

const TablaAdmins = (adminList) => {
  const myAdmins =adminList.adminList[0];
  const myRoles = adminList.adminList[1];
  console.log(adminList);
  const adminRowsArray = [];

  for (let i = 0; i < myAdmins.length; i++){
    for (let j = 0; j < myRoles.length; j++) {
      console.log(myAdmins[i].attributes.rol.id, myRoles[j].id);
      if(myAdmins[i].attributes.rol.id === myRoles[j].id){
        adminRowsArray.push({admin: myAdmins[i].attributes.Admin, rol: myRoles[j], username:myAdmins[i].attributes.username  });
        break;
      }
    }
  }
  const roleOptions = myRoles.map((role) => (
      <option value={role.id}> {role.attributes.NombreRol}</option>
  ));



console.log(adminRowsArray);
  const tableElements = adminRowsArray.map((row) => (
    <tr>
          <td>{row.username}</td>
          <td>
            <Container>
              <Row>
              <Col s={10} m={10}>
                <FormSelect aria-label = {row.username} >
                  <option value={row.username}>Rol actual: {row.rol.attributes.NombreRol}    </option>
                  {roleOptions}
                </FormSelect>          
              </Col>
              <Col className="col-2">
                <Button>Guardar</Button>
              </Col>
              </Row>
            </Container>
                        
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