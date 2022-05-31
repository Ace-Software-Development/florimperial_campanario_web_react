import {useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom';
import Parse from 'parse';
import '../css/Home.css'
import {useParseQuery} from '@parse/react';
import ParseObject from 'parse/lib/browser/ParseObject';
import Button from 'react-bootstrap/Button';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SidenavOverlay from '../components/SidenavOverlay';
import {getPermissions, checkUser} from '../utils/client'
import CirculoCarga from "../components/CirculoCarga";
import HomeIcons from '../components/HomeIcons'

export default function Home() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});

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
      <Sidebar permissions = {permissions} />
      <Header processName={"Inicio"}/>

      <div className="home-cards">
        <HomeIcons permissions = {permissions}  />
      </div>
    </div>
  );
}
