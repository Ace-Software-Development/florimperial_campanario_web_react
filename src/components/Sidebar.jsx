import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import '../css/Dashboard.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import React from "react"

function Sidebar(){
    return(
    <Router>
    <Route render={({ location, history }) => (
        <React.Fragment>
            <SideNav
                onSelect={(selected) => {   
                    const to = '/' + selected;
                    if (location.pathname !== to) {
                        history.push(to);
                    }
                    window.location.reload();
                }}
            >
                <SideNav.Toggle />
    <SideNav.Nav defaultSelected="home">
        
        <NavItem eventKey="home">
            <NavIcon>
                <ion-icon name="home" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Inicio
            </NavText>
        </NavItem>
        
        {/* <NavItem eventKey="socios">
            <NavIcon>
                <ion-icon name="people" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Socios
            </NavText>
        </NavItem> */}
        
        <NavItem eventKey="anuncios">
            <NavIcon>
                <ion-icon name="newspaper" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Anuncios
            </NavText>
        </NavItem>
        
        {/*<NavItem eventKey="sugerencias">
            <NavIcon>
                <ion-icon name="bulb" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Sugerencias
            </NavText>
        </NavItem>*/}
        
        {/*<NavItem eventKey="perfil">
            <NavIcon>
                <ion-icon name="person" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Perfil
            </NavText>
        </NavItem>*/}
        
        {/*<NavItem eventKey="control-de-accesos">
            <NavIcon>
                <ion-icon name="lock-closed" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Control de accesos
            </NavText>
        </NavItem>*/}
        
        {/*<NavItem eventKey="reglas">
            <NavIcon>
                <ion-icon name="book" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Reglas
            </NavText>
        </NavItem>*/}
        
        <NavItem eventKey="golf">
            <NavIcon>
                <ion-icon name="golf" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Golf
            </NavText>
            <NavItem eventKey="golf/salidas">
                <NavText>
                    Reservaciones
                </NavText>
            </NavItem>
        </NavItem>
        
        {/*<NavItem eventKey="raqueta">
            <NavIcon>
                <ion-icon name="tennisball" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Raqueta
            </NavText>
            <NavItem eventKey="raqueta/reservaciones">
                <NavText>
                    Reservaciones
                </NavText>
            </NavItem>
            <NavItem eventKey="raqueta/canchas">
                <NavText>
                    Canchas
                </NavText>
            </NavItem>
        </NavItem>*/}
        
        {/*<NavItem eventKey="gimnasio" style={{ fontSize: '1.25em' }}>
            <NavIcon>
                <ion-icon name="barbell"></ion-icon>
            </NavIcon>
            <NavText>
                Gimnasio
            </NavText>
            <NavItem eventKey="gimnasio/reservaciones">
                <NavText>
                    Reservaciones
                </NavText>
            </NavItem>
            <NavItem eventKey="raqueta/rutinas">
                <NavText>
                    Rutinas
                </NavText>
            </NavItem>
        </NavItem>*/}
        
        {/*<NavItem eventKey="Alberca">
            <NavIcon>
                <ion-icon name="water" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Alberca
            </NavText>
            <NavItem eventKey="alberca/reservaciones">
                <NavText>
                    Reservaciones
                </NavText>
            </NavItem>
        </NavItem>*/}

        <NavItem eventKey="cerrar-sesion">
            <NavIcon>
                <ion-icon name="log-out" style={{ fontSize: '1.25em' }}></ion-icon>
            </NavIcon>
            <NavText>
                Cerrar sesión
            </NavText>
        </NavItem>

    </SideNav.Nav>
    </SideNav>
        </React.Fragment>
    )}
    />
</Router>
    )
}

export default Sidebar