import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import {checkUser} from '../utils/client';
import CirculoCarga from '../components/CirculoCarga';
export default function Screen(props) {
  // Permissions
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
  let header = '';
  if (props.title === 'none') {
    header = <div style={{flexGrow: 1, padding: '1rem'}}></div>;
  } else {
    header = (
      <div style={{flexGrow: 1, padding: '1rem'}}>
        <Header processName={props.title} />
      </div>
    );
  }

  if (loading)
    return (
      <span>
        <CirculoCarga />
      </span>
    );

  return (
    <div style={{display: 'flex', flexDirection: 'row', height: '100vh'}}>
      <Sidebar permissions={permissions} screenPath={props.screenPath} />
      <div style={{flexGrow: 1, padding: '2rem'}}>
        {header}
        {props.children}
      </div>
    </div>
  );
}
