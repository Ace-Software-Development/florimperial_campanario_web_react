// 
import '../css/Rutinas.css';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Screen from '../components/Screen';
import {checkUser} from '../utils/client';
import CirculoCarga from '../components/CirculoCarga';
import TablaRutinas from '../components/TablaRutinas';



export default function Home() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});

  useEffect(async () => {
    const permissionsJson = await checkUser();
    if (permissionsJson === 'NO_USER') {
      alert('Necesitas haber ingresado al sistema para consultar esta página.');
      history.push('/');
    } else if (permissionsJson === 'NOT_ADMIN') {
      alert('Necesitas ser administrador para acceder al sistema.');
      history.push('/');
    } else if (permissionsJson === 'INVALID_SESSION') {
      alert('Tu sesión ha finalizado. Por favor, inicia sesión nuevamente.');
      history.push('/');
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

  if (loading)
    return (
      <span>
        <CirculoCarga />
      </span>
    );

  return (
    <Screen permissions={permissions} title="Rutinas">
      <div className="App">
          <br/>
          <TablaRutinas/>
      </div>
    </Screen>
  );
}