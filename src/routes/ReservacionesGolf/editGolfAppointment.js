import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import Parse from 'parse';
import moment from 'moment';

/* NOTAS */
// -- ANTES
 // talv ez poner un constructor o poner esto como componente
    // me quede en que hay que poner la fech bien en el cuadro de datepicker; no como string sino como date o algo
    // el hoyo que se pone por default es el 10 y deberia ser el correcto....


// --HOY 03/05/2022
// PROBLEMA: NO SE PASAN LOS PARAMETROS, o si se pasan pero no los agarra la funcion
// Me quee en que hay que poner los socios invitados y externos invitados...
// Una vez se despliegue bien la informacion en el modal, se podra hacer commit y push
// el useEffect se ejecuta cuando se ejecuta el index.js y no cuando se abre el appointment

// Despues de eso, ya se podran editar y todo. (Invitados, externos, numero de carritos y hoyos, hoyo de salida (checar que no haya otra reservacion en ese misma hora en ese mismo hoyo)... 

// const SociosInvitados = (props) => {
//     <ol>
//         // <li>{/* nombre del socio */}</li>
//         <li>hola</li>
//     </ol>
// }

// const ExternosInvitados = (props) => {
//     <ol>
//         // <li>{/* nombre del invitado */}</li>
//         <li>hola</li>    
//     </ol>
// }


export default function EditGolfAppintment(props) {
    const { register, handleSubmit } = useForm();
    const [reservacionGolfId, setReservacionGolfId] = useState("");
    const [titulo, setTitulo] = useState("");
    const [reservacionId, setReservacionId] = useState("");
    const [horaSalida, setHoraSalida] = useState("");
    const [socioId, setSocioId] = useState("");
    const [maximoJugadores, setMaximoJugadores] = useState();
    const [hoyoSalidaId, setHoyoSalidaId] = useState("");
    const [hoyoSalidaNombre, setHoyoSalidaNombre] = useState("");
    const [hoyoUnoChecked, setHoyoUnoChecked] = useState();
    const [carritosReservados, setCarritosReservados] = useState();
    const [sociosInvitados, setSociosInvitados] = useState([]);
    const [externosInvitados, setExternosInvitados] = useState([]);

    useEffect(() => {
        console.log('hola');
        console.log(props);
        
        function setAppointmentData() {
            setReservacionGolfId(props.reservacionGolfId);
            setTitulo(props.titulo);
            setReservacionId(props.reservacionId);
            setHoraSalida(props.horaSalida);
            setSocioId(props.socioId);
            setMaximoJugadores(props.maximoJugadores);
            setHoyoSalidaId(props.hoyoSalidaId);
            setHoyoSalidaNombre(props.hoyoSalidaNombre);
            setHoyoUnoChecked(props.hoyoUnoChecked);
            setCarritosReservados(props.carritosReservados);

            return;
        }

        async function getInvitados() {
            try {
                const query = new Parse.Query('ReservacionInvitado');
                query.include("socio");
                query.include("invitado");
                query.include(["socio.cuenta"]);
                query.equalTo("reservacion", reservacionId);

                const invitados = await query.find();
                const resultsSociosInvitados = new Array();
                const resultsExternosInvitados = new Array();

                for (var i = 0; i < invitados.length; i++) {
                    if (invitados[i].get("socio")) {
                        console.log('Es un socio');
                        const noAccion = invitados[i].get("socio").get("cuenta").get("noAccion");
                        const nombreSocio = invitados[i].get("socio").get("nombre");
                        const registro = noAccion + " " + nombreSocio;

                        resultsSociosInvitados.push(registro);
                    } else if (invitados[i].get("invitado")) {
                        console.log('Es un invitado');

                        resultsExternosInvitados.push(invitados[i].get("invitado").get("nombre"));
                    }
                }

                setSociosInvitados(resultsSociosInvitados);
                setExternosInvitados(resultsExternosInvitados);

                console.log(sociosInvitados);
                console.log(externosInvitados);
            } catch (error) {
                console.log(`Ha ocurrido un error al obtener los invitados: ${ error }`);
            }
        }

        setAppointmentData();
        getInvitados();

        return;
    }, [])

    const handleClose = () => {
        props.onClose(false);
    }

    async function handleData(data) {
        // try {
        //     const getSitio = new Parse.Query('Sitio');
        //     getSitio.equalTo("nombre", hoyoSalida);

        //     getSitio.find().then(function(sitio) {
        //         return sitio;
        //     }).then(function(results) {
        //         const Reservacion = Parse.Object.extend("Reservacion");
        //         const reservacion = new Reservacion();
        //         // checar que la startDate (string) se puede convertir a (Date)...
        //         // const horaSalida = moment(start).toDate();
        //         // obtener directo el maximoJugadores
        //         const maximoJugadores = Number(document.getElementById('maximoJugadores').value);

        //         reservacion.set("fechaInicio", horaSalida);
        //         reservacion.set("sitio", results[0]);
        //         reservacion.set("maximoJugadores", maximoJugadores);
        //         reservacion.set("estatus", 1);
                
        //         return reservacion.save();
        //     }).then(function(reservacionId) {
        //         const ReservacionGolf = Parse.Object.extend("ReservacionGolf");
        //         const reservacionGolf = new ReservacionGolf();
                
        //         reservacionGolf.set("reservacion", reservacionId);

        //         return reservacionGolf.save();
        //     }).then(function(reservacionGolfId) {
        //         prompt('La reservación se creó correctamente.');
        //         handleClose();
        //     }, function(error) {
        //         alert(error);
        //     });
        // } catch (error) {
        //     console.log(`Ha ocurrido un error: ${ error }`);
        // }
    }

    function changeHoyoSalida(nuevoHoyo, isChecked) {
        setHoyoSalidaNombre(nuevoHoyo);
        setHoyoUnoChecked(isChecked);
    }

    function changeNumeroJugadores(nuevoMaximo) {
        setMaximoJugadores(nuevoMaximo);
    }

    function changeCarritosReservados(nuevosCarritosReservados) {
        setCarritosReservados(nuevosCarritosReservados);
    }

    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle> {titulo} </DialogTitle>
            <DialogContent> 
                <form onSubmit={handleSubmit(handleData)}> 
                    <div>
                        <label>Hora de salida</label>
                        <Datetime value={new Date()} onChange={date => setHoraSalida(date)} />
                    </div>
                    <div className="radio">
                        <label>
                            <input
                                type="radio"
                                value={hoyoSalidaNombre}
                                checked={hoyoUnoChecked}
                                onChange={hoyo => changeHoyoSalida('Hoyo 1', true)}
                            />
                            Hoyo 1
                        </label>
                        <label>
                            <input
                                type="radio"
                                value={hoyoSalidaNombre}
                                checked={!hoyoUnoChecked}
                                onChange={hoyo => changeHoyoSalida('Hoyo 10', false)}
                            />
                            Hoyo 10
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                defaultValue={maximoJugadores}
                                onChange={maximoJugadores => changeNumeroJugadores(maximoJugadores)}
                            />
                            Carritos Reservados
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                defaultValue={carritosReservados}
                                onChange={carritosReservados => changeCarritosReservados(carritosReservados)}
                            />
                            Máximo número de jugadores
                        </label>
                    </div>
                    <div>
                        Socios Invitados
                    </div>
                    <div>
                        Externos Invitados
                    </div>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit">Crear</Button>
                    </DialogActions> 
                </form>
            </DialogContent>
        </Dialog>
    )
}