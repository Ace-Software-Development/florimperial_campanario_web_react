import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './pages/Home';
import Auth from './pages/Auth';
import Anuncios from './pages/Anuncios'
import DetalleAnun from './pages/DetalleAnun'
import SalidasGolf from './pages/Golf/SalidasGolf'
import PasswordRecovery from './pages/PasswordRecovery';

export default function App() {
  return (
    <Router>
      <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path= "/anuncios/:anuncioId" render={()=> {
           return (
            <div>
              <DetalleAnun/>
            </div>
          )
         }
         }    
         />
        <Route path="/golf/salidas">
            <SalidasGolf />
        </Route>
          <Route path="/anuncios">
            <Anuncios />
          </Route>
          <Route path="/recovery">
            <PasswordRecovery  />
          </Route>
          <Route path="/">
            <Auth />
          </Route>

         


        </Switch>
    </Router>
  );
}