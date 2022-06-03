import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './pages/Home';
import Auth from './pages/Auth';
import Anuncios from './pages/Anuncios';
// import SalidasGolf from './pages/Golf/SalidasGolf';
import PasswordRecovery from './pages/PasswordRecovery';
import GestionSocios from './pages/GestionSocios';
import LogOut from './pages/CerrarSesion';
import { getAllAvailableReservations, getReservationGolf } from './utils/client';
import Reservations from './pages/Reservations';
import { useEffect, useState } from 'react';

// import {getAllGolfAppointmentSlots} from '../utils/client';


export default function App() {
    const [golfReservationData, setGolfReservationData] = useState(null);

    useEffect(async () => {
        const data = await getAllAvailableReservations('golf');
        setGolfReservationData(data);
    }, [])

    return (
    <Router>
        <Switch>
            <Route path="/home">
                <Home />
            </Route>

            <Route path="/golf/salidas">
                <Reservations // cambiar este componente por <Reservations />
                    // Reservation Calendar
                    screenTitle='Reservaciones de Golf'
                    screenPath='golf/salidas'
                    reservationsData={ golfReservationData } // Here we need to get the data from db and format it

                    // Edit and create Reservation
                    sitios={[]}
                    coachInput={true}
                    guestsInput={true}
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