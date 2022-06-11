import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import '../css/Dashboard.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import React from 'react';

export default function Sidebar(props) {
  let anuncios,
    golf,
    raqueta,
    salones_gym,
    gestion,
    alberca = '';
  if (props.permissions.Anuncios === false) {
    anuncios = 'none';
  }
  if (props.permissions.Raqueta === false) {
    raqueta = 'none';
  }
  if (props.permissions.Salones_gym === false) {
    salones_gym = 'none';
  }
  if (props.permissions.Golf === false) {
    golf = 'none';
  }
  if (props.permissions.Gestion === false) {
    gestion = 'none';
  }
  if (props.permissions.Alberca === false) {
    alberca = 'none';
  }

  return (
    <Router>
      <Route
        render={({location, history}) => (
          <React.Fragment>
            <SideNav
              onSelect={selected => {
                const to = '/' + selected;
                if (location.pathname !== to) {
                  history.push(to);
                }
                window.location.reload();
              }}
            >
              <SideNav.Toggle />
              <SideNav.Nav defaultSelected={props.screenPath}>
                <NavItem eventKey="home">
                  <NavIcon>
                    <ion-icon name="home" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Inicio</NavText>
                </NavItem>

                <NavItem eventKey="gestion-de-socios" style={{display: `${gestion}`}}>
                  <NavIcon>
                    <ion-icon name="people" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Socios</NavText>

                  <NavItem eventKey="lista-de-socios">
                    <NavText>Lista de socios</NavText>
                  </NavItem>

                  <NavItem eventKey="gestion-de-socios">
                    <NavText>Gestión de socios</NavText>
                  </NavItem>
                </NavItem>

                <NavItem eventKey="anuncios" style={{display: `${anuncios}`}}>
                  <NavIcon>
                    <ion-icon name="newspaper" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Anuncios</NavText>
                </NavItem>

                <NavItem eventKey="sugerencias">
                  <NavIcon>
                    <ion-icon name="bulb" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Sugerencias</NavText>
                </NavItem>

                <NavItem eventKey="mi-perfil">
                  <NavIcon>
                    <ion-icon name="person" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Perfil</NavText>
                </NavItem>

                <NavItem eventKey="panel-de-administradores" style={{display: `${gestion}`}}>
                  <NavIcon>
                    <ion-icon name="lock-closed" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Panel de administradores</NavText>
                </NavItem>

                {/* <NavItem eventKey="reglas" style={{display: `${gestion}`}}>
                  <NavIcon>
                    <ion-icon name="book" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Reglas</NavText>
            </NavItem>*/}

                <NavItem eventKey="golf" style={{display: `${golf}`}}>
                  <NavIcon>
                    <ion-icon name="golf" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Golf</NavText>
                  <NavItem eventKey="golf/salidas">
                    <NavText>Reservaciones</NavText>
                  </NavItem>

                  <NavItem eventKey="golf/reglamento">
                    <NavText>Reglamento</NavText>
                  </NavItem>
                </NavItem>

                <NavItem eventKey="raqueta" style={{display: `${raqueta}`}}>
                  <NavIcon>
                    <ion-icon name="tennisball" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Raqueta</NavText>
                  <NavItem eventKey="raqueta/reservaciones">
                    <NavText>Reservaciones</NavText>
                  </NavItem>
                  {/* <NavItem eventKey="raqueta/canchas">
                    <NavText>Canchas</NavText>
            </NavItem>*/}
                  <NavItem eventKey="raqueta/reglamento">
                    <NavText>Reglamento</NavText>
                  </NavItem>
                </NavItem>

                <NavItem eventKey="gym" style={{display: `${salones_gym}`}}>
                  <NavIcon>
                    <ion-icon name="barbell"></ion-icon>
                  </NavIcon>
                  <NavText>Gimnasio</NavText>
                  <NavItem eventKey="gym/reservaciones">
                    <NavText>Reservaciones</NavText>
                  </NavItem>

                  {/*  <NavItem eventKey="gym/rutinas">
                    <NavText>Rutinas</NavText>
            </NavItem>*/}
                  <NavItem eventKey="gym/reglamento">
                    <NavText>Reglamento</NavText>
                  </NavItem>
                  <NavItem eventKey="gym/rutinas">
                    <NavText>Rutinas</NavText>
                  </NavItem>
                </NavItem>

                <NavItem eventKey="Alberca" style={{display: `${alberca}`}}>
                  <NavIcon>
                    <ion-icon name="water" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Alberca</NavText>
                  <NavItem eventKey="alberca/reservaciones">
                    <NavText>Reservaciones</NavText>
                  </NavItem>
                  <NavItem eventKey="alberca/reglamento">
                    <NavText>Reglamento</NavText>
                  </NavItem>
                </NavItem>

                <NavItem eventKey="salones" style={{display: `${salones_gym}`}}>
                  {/*<NavIcon>
                    <ion-icon name="water" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>*/}
                  <NavText>Salones</NavText>
                  <NavItem eventKey="salones/clinicas">
                    <NavText>Reservaciones</NavText>
                  </NavItem>
                  <NavItem eventKey="salones/reglamento">
                    <NavText>Reglamento</NavText>
                  </NavItem>
                </NavItem>

                <NavItem eventKey="cerrar-sesion">
                  <NavIcon>
                    <ion-icon name="log-out" style={{fontSize: '1.25em'}}></ion-icon>
                  </NavIcon>
                  <NavText>Cerrar sesión</NavText>
                </NavItem>
              </SideNav.Nav>
            </SideNav>
          </React.Fragment>
        )}
      />
    </Router>
  );
}
