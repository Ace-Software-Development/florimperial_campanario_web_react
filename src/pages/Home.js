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
import {getPermissions} from '../utils/client'
import CirculoCarga from "../components/CirculoCarga";
import HomeIcons from '../components/HomeIcons'

export default function Home() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});

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
      <Sidebar permissions = {permissions} />
      <Header processName={"Inicio"}/>

      <div className="home-cards">
        <HomeIcons permissions = {permissions}  />
      </div>
    </div>
  );
}
