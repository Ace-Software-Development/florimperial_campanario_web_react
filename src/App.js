import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Anuncios from './pages/Anuncios';
import PasswordRecovery from './pages/PasswordRecovery';
import GestionSocios from './pages/GestionSocios';
import LogOut from './pages/CerrarSesion';
import Reservations from './pages/Reservations';
import {useState, useEffect} from 'react';
import {getAreaByName, getSitiosByArea} from './utils/client';
import {formatSitioData} from './utils/formatData';
import RegulationsPage from './pages/RegulationsPage';

import PanelAdmins from './pages/PanelAdmins';
import NumeroSoporte from './pages/NumeroSoporte';
import ReservacionesSocio from './pages/ReservacionesSocio';
import MiPerfil from './pages/MiPerfil';
import ReservationsClinicas from './pages/ReservationsClinicas';
import ListaSocios from './pages/ListaSocios';
import PerfilSocio from './pages/PerfilSocio';
import Sugerencias from './pages/Sugerencias';
import Rutinas from './pages/Rutinas';

export default function App() {
  const [sitiosData, setSitiosData] = useState([]);

  useEffect(async () => {
    const golfArea = await getAreaByName('Golf');
    const gymArea = await getAreaByName('Gimnasio');
    const raquetaArea = await getAreaByName('Raqueta');
    const poolArea = await getAreaByName('Alberca');
    const salonArea = await getAreaByName('Salones');

    const golfSitios = await getSitiosByArea(golfArea.id);
    const gymSitios = await getSitiosByArea(gymArea.id);
    const raquetaSitios = await getSitiosByArea(raquetaArea.id);
    const poolSitios = await getSitiosByArea(poolArea.id);
    const salonSitios = await getSitiosByArea(salonArea.id);

    setSitiosData({
      golf: golfSitios.map(i => formatSitioData(i)),
      gym: gymSitios.map(i => formatSitioData(i)),
      raqueta: raquetaSitios.map(i => formatSitioData(i)),
      pool: poolSitios.map(i => formatSitioData(i)),
      salones: salonSitios.map(i => formatSitioData(i))
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route
          path="/reservaciones/socios/:socioId"
          render={() => {
            return (
              <div>
                <ReservacionesSocio />
              </div>
            );
          }}
        />
        <Route path="/golf/salidas">
          <Reservations
            // Reservation Calendar
            screenTitle="Reservaciones de Golf"
            screenPath="golf/salidas"
            // Edit and create Reservation
            module={'golf'}
            sitios={sitiosData.golf}
            coachInput={true}
            guestsInput={true}
          />
        </Route>

        <Route path="/golf/reglamento">
          <RegulationsPage module={'Golf'} />
        </Route>

        <Route path="/gym/reservaciones">
          <Reservations
            // Reservation Calendar
            screenTitle="Reservaciones de Gimnasio"
            screenPath="gym/reservaciones"
            // Edit and create Reservation
            module={'gym'}
            sitios={sitiosData.gym}
            coachInput={true}
            guestsInput={false}
          />
        </Route>

        <Route path="/gym/reglamento">
          <RegulationsPage module={'Gimnasio'} />
        </Route>

        <Route path="/gym/rutinas">
          <Rutinas/>
        </Route>

        <Route path="/raqueta/reservaciones">
          <Reservations
            // Reservation Calendar
            screenTitle="Reservaciones de Raqueta"
            screenPath="raqueta/reservaciones"
            // Edit and create Reservation
            module={'raqueta'}
            sitios={sitiosData.raqueta}
            coachInput={true}
            guestsInput={true}
          />
        </Route>

        <Route path="/raqueta/reglamento">
          <RegulationsPage module={'Raqueta'} />
        </Route>

        <Route path="/alberca/reservaciones">
          <Reservations
            // Reservation Calendar
            screenTitle="Reservaciones de Alberca"
            screenPath="alberca/reservaciones"
            // Edit and create Reservation
            module={'pool'}
            sitios={sitiosData.pool}
            coachInput={true}
            guestsInput={false}
          />
        </Route>

        <Route path="/alberca/reglamento">
          <RegulationsPage module={'Alberca'} />
        </Route>

        <Route path="/salones/clinicas">
          <ReservationsClinicas 
            screenTitle="Clases de salones"
            screenPath="salones/clases"
            module="Salones"
            sitios={sitiosData.salones}

          />
        </Route>

        <Route path="/anuncios">
          <Anuncios />
        </Route>

        <Route path="/gestion-de-socios">
          <GestionSocios />
        </Route>
        <Route path="/lista-de-socios">
          <ListaSocios />
        </Route>

        <Route path="/numero-soporte">
          <NumeroSoporte />
        </Route>

        <Route path="/mi-perfil">
          <MiPerfil />
        </Route>

        <Route path="/recovery">
          <PasswordRecovery />
        </Route>

        <Route path="/cerrar-sesion">
          <LogOut />
        </Route>

        <Route path="/panel-de-administradores">
          <PanelAdmins />
        </Route>
        <Route path="/sugerencias">
          <Sugerencias />
        </Route>

        <Route path="/">
          <Auth />
        </Route>
      </Switch>
    </Router>
  );
}
