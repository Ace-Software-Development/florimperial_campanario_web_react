import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './pages/Home';
import Auth from './pages/Auth';
import Anuncios from './pages/Anuncios';
import PasswordRecovery from './pages/PasswordRecovery';
import GestionSocios from './pages/GestionSocios';
import LogOut from './pages/CerrarSesion';
import Reservations from './pages/Reservations';
import { useState, useEffect } from 'react';
import { getAreaByName, getSitiosByArea } from './utils/client';
import { formatSitioData } from './utils/formatData';
import RegulationsPage from './pages/RegulationsPage';


export default function App() {
    const [sitiosData, setSitiosData] = useState([]);

    useEffect(async () => {
        const golfArea = await getAreaByName('Golf');
        const gymArea = await getAreaByName('Gimnasio');
        const raquetaArea = await getAreaByName('Raqueta');
        const poolArea = await getAreaByName('Alberca');

        const golfSitios = await getSitiosByArea(golfArea.id);
        const gymSitios = await getSitiosByArea(gymArea.id);
        const raquetaSitios = await getSitiosByArea(raquetaArea.id);
        const poolSitios = await getSitiosByArea(poolArea.id);

        setSitiosData({
            golf: golfSitios.map(i => formatSitioData(i)),
            gym: gymSitios.map(i => formatSitioData(i)),
            raqueta: raquetaSitios.map(i => formatSitioData(i)),
            pool: poolSitios.map(i => formatSitioData(i))
        });
    }, []);

    return (
    <Router>
        <Switch>
            <Route path="/home">
                <Home />
            </Route>

            <Route path="/golf/salidas">
                <Reservations
                    // Reservation Calendar
                    screenTitle='Reservaciones de Golf'
                    screenPath='golf/salidas'

                    // Edit and create Reservation
                    module={'golf'}
                    sitios={sitiosData.golf}
                    coachInput={true}
                    guestsInput={true}
                />
            </Route>

            <Route path="/golf/reglamento">
                <RegulationsPage
                    module={'golf'}
                />
            </Route>

            <Route path="/gym/reservaciones">
                <Reservations
                    // Reservation Calendar
                    screenTitle='Reservaciones de Gimnasio'
                    screenPath='gym/reservaciones'

                    // Edit and create Reservation
                    module={'gym'}
                    sitios={sitiosData.gym}
                    coachInput={true}
                    guestsInput={false}
                />
            </Route>

            <Route path="/raqueta/reservaciones">
                <Reservations
                    // Reservation Calendar
                    screenTitle='Reservaciones de Raqueta'
                    screenPath='raqueta/reservaciones'

                    // Edit and create Reservation
                    module={'raqueta'}
                    sitios={sitiosData.raqueta}
                    coachInput={true}
                    guestsInput={true}
                />
            </Route>

            <Route path="/alberca/reservaciones">
                <Reservations
                    // Reservation Calendar
                    screenTitle='Reservaciones de Alberca'
                    screenPath='alberca/reservaciones'

                    // Edit and create Reservation
                    module={'pool'}
                    sitios={sitiosData.pool}
                    coachInput={true}
                    guestsInput={false}
                />
            </Route>

            <Route path="/anuncios">
                <Anuncios />
            </Route>

            <Route path="/gestion-de-socios">
                <GestionSocios />
            </Route>

            <Route path="/recovery">
                <PasswordRecovery  />
            </Route>

            <Route path="/cerrar-sesion">
                <LogOut  />
            </Route>

            <Route path="/">
                <Auth />
            </Route>
        </Switch>
    </Router>
    );
}

// TODO: hacer una query que junte las queries de getReservationGolf() y getAllGolfAppointmentSlots()
// ojo que getAllGolfAppointmentSlots regresa una lista de reservaciones generales 
// y getReservationGolf

// Este es el formato en el que se tiene que regresar la información de las queries, si algo no coincide puede que no funcione 
// [
//     {
//         'objectId': appointment.id,
//         'id': appointment.id,
//         'title': appointment.get("user")===undefined || appointment.get("estatus") === 1 ? 'Disponible' : appointment.get("user").get("username"),
//         'start': appointment.get("fechaInicio"),
//         'estatus': appointment.get("estatus"),
//         'maximoJugadores': appointment.get("maximoJugadores"),
//         'sitio': {
//             'objectId': appointment.get("sitio").id,
//             'nombre': appointment.get("sitio").get("nombre"),
//             'tableName': 'Sitio'
//         },
//         'profesor': appointment.get('profesor') ? {
//             'objectId': appointment.get('profesor').id,
//             'nombre': appointment.get('profesor').get('nombre'),
//             'tableName': 'Profesor'
//         } : null,
//         'user': appointment.get('user') ? { // only present if it's a single user reservation
//             'objectId': appointment.get('user').id,
//             'username': appointment.get('user').get('username'),
//             'tableName': 'User'
//         } : null,
//         'golfAppointment': { // only present if it's a golf reservation
//             'objectId': '',
//             'carritosReservados': 0,
//             'cantidadHoyos': 9,
//             'reservation': {
//                 'objectId': ''
//             },
//         }
//     },
// ]

// const sitios = [
//     {
//         'objectId': '...',
//         'nombre': 'Hoyo 1',
//     },
//     {
//         'objectId': '...',
//         'nombre': 'Hoyo 10',
//     },
//     {
//         'objectId': '...',
//         'nombre': 'Tee de practica',
//     },
// ]

// const testData = [
//     {
//         'objectId': "1yJiN1uBBA",
//         'id': "1yJiN1uBBA",
//         'title': "daniel",
//         'start': "16May2022T18:30:00",
//         'estatus': 1,
//         'maximoJugadores': 5,
//         'sitio': {
//             'objectId': "f9UD2GDs2e",
//             'nombre': "Hoyo 10",
//             'tableName': 'Sitio'
//         },
//         'profesor': null,
//         'user': null,
//         'golfAppointment': { // only present if it's a golf reservation
//             'objectId': '',
//             'carritosReservados': 0,
//             'cantidadHoyos': 9,
//             'reservation': {
//                 'objectId': ''
//             },
//         }
//     },
// ]