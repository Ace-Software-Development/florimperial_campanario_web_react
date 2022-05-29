import {useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom';
import Parse from 'parse';
import CirculoCarga from '../components/CirculoCarga';

export default function LogOut() {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

      useEffect(async() => {
        try {
          setLoading(true);
          Parse.User.logOut().then(() => {
            history.push('/');
            window.location.reload();
          });        
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      }, []);
    
      if (loading){
        return(<CirculoCarga/>)
      }

  return (
    <div className="App">
    </div>
  );
}
