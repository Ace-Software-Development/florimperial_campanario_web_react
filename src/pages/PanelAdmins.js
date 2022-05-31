import '../css/GestionSocios.css'
import React from "react";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Sidebar from '../components/Sidebar';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Parse from "parse";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal"
import TablaAdmins from '../components/TablaAdmins';
import { useEffect, useState } from "react";
import CirculoCarga from "../components/CirculoCarga";
import {createMember, getPermissions, } from '../utils/client'
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

  useEffect(async() => {
    async function checkUser() {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        alert(
          "Necesitas haber ingresado al sistema para consultar esta página."
        );  
        history.push("/");
      }
      else if (currentUser.attributes.isAdmin == false) {
        alert(
          "Necesitas ser administrador para acceder al sistema."
        );
        history.push("/");
      }
      try{
        const permissionsJson = await getPermissions(currentUser.attributes.AdminPermissions.id);
        return(permissionsJson);
      }
      catch(e){
        const permissionsJson={unauthorized: true};
        alert("Ha ocurrido un error al procesar tu petición. Por favor vuelve a intentarlo.");
        history.push('/');
        return(permissionsJson);
      }
    
    }

    try {
      setLoading(true);
      const permissionsJson = await checkUser();
      setPermissions(permissionsJson);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }

  }, []);


  if(loading) return (
    <span><CirculoCarga/></span>
  );


  return (
    <div className="App">
      <Sidebar permissions = {permissions}/>
      <Header processName={"Panel de administradores"} />
      <div style={{"marginLeft":"145px" }}>
        <Card style={{width: "70%"}}>
          <TablaAdmins/>
        </Card>  
      </div>      
      
    </div>
  );
}
