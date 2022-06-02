import '../css/GestionSocios.css'
import React from "react";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Sidebar from '../components/Sidebar';
import Card from "react-bootstrap/Card";
import TablaAdmins from '../components/TablaAdmins';
import { useEffect, useState } from "react";
import CirculoCarga from "../components/CirculoCarga";
import { checkUser,getAdminUsers, getRolesNames } from '../utils/client'
import { useHistory } from "react-router-dom";
import Header from '../components/Header';


export default function PanelAdmins() {
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
  const [adminList, setAdminList] = useState([]);
  const [roleNames, setRoleNames] = useState([]);
  const [props, setProps] = useState([]);
  useEffect(async() => {
    const permissionsJson = await checkUser();
    if(permissionsJson === 'NO_USER') {
      alert(
        "Necesitas haber ingresado al sistema para consultar esta página."
      );  
      history.push("/");
    }
    else if (permissionsJson === 'NOT_ADMIN'){
      alert(
        "Necesitas ser administrador para acceder al sistema."
      );
      history.push("/");
    }
    else if (permissionsJson === 'INVALID_SESSION'){
      alert(
        "Tu sesión ha finalizado. Por favor, inicia sesión nuevamente."
      );
      history.push("/");
    }
    setPermissions(permissionsJson);

    try {
      setLoading(true);
      const permissionsJson = await checkUser();
      setPermissions(permissionsJson);
      /*
      fetchUsers().then((admins)=>{
        setAdminList(admins)
          fetchRoleNames().then((roleNames)=>{
            setRoleNames(roleNames);
            const propArray=[];
            propArray.push(adminList);
            propArray.push(roleNames);    
            setProps(propArray);
          })
      });*/

          
      const admins = await getAdminUsers();
      const a = await setAdminList(admins);
      const roleNames = await getRolesNames();
      const b = await setRoleNames(roleNames);
      const propArray=[];
      propArray.push(adminList);
      propArray.push(roleNames);
      await setProps(propArray);
      await setLoading(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }

  }, []);
  useEffect(async() => {
    
  
      const propArray=[];
      propArray.push(adminList);
      propArray.push(roleNames);
      await setProps(propArray);

  }, [adminList, roleNames]);

  if(loading) return (
    <span><CirculoCarga/></span>
  );
  
  return (
    <div className="App">
      <Sidebar permissions = {permissions}/>
      <Header processName={"Panel de administradores"} />
      <div style={{"marginLeft":"145px" }}>
        <Card style={{width: "70%"}}>
          <TablaAdmins adminList={props} />
        </Card>  
      </div>      
      
    </div>
  );
}
