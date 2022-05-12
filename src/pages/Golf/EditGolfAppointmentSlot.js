import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
// import { useForm } from 'react-hook-form';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
// import moment from 'moment';

export default function EditGolfAppointmentSlot(props) {
    const [isLoading, setLoading] = useState(true);
    const [startingDate, setStartingDate] = useState(new Date());
    const [startingHole, setStartingHole] = useState("");
    const [holeOneChecked, setHoleOneChecked] = useState(false);
    const [maxPlayers, setMaxPlayers] = useState();
    const [reservedKarts, setReservedKarts] = useState(0);
    const [invitadosSocios, setInvitadosSocios] = useState([]);
    const [invitados, setInvitados] = useState([]);

    // const { register, handleSubmit } = useForm();


    useEffect(() => {
        async function getAppointmentData() {
            try {
                const appointmentId = String(props.appointmentId);
    
                const getAppointment = new Parse.Query("ReservacionGolf");            
                getAppointment.include("reservacion");
                getAppointment.include(["reservacion.sitio"]);
                getAppointment.include(["reservacion.user"]);
                getAppointment.equalTo("objectId", appointmentId);
    
                getAppointment.find().then(function(results) {
                    return results;
                }).then(function(results) {
                    if (results.length === 0) return null;

                    setStartingDate(results[0].get("reservacion").get("fechaInicio"));
                    setMaxPlayers(results[0].get("reservacion").get("maximoJugadores"));
                    setStartingHole(results[0].get("reservacion").get("sitio").get("nombre"));
                    if (results[0].get("carritosReservados") !== undefined) {
                        setReservedKarts(results[0].get("carritosReservados"));
                    }

                    // aca abajo va lo de invitados   
                    // if (results[0].get("reservacion").get("socio")) return null;

                    // // get invitados del socio...
                    // const getGuests = new Parse.Query("ReservacionInvitado");
                    // // getGuests.include("")
                    // getGuests.equalTo("reservacion", results[0].get("reservacion"));

                    // return getGuests.find();
                }, function(error) {
                    alert(`Ha ocurrido un error: ${ error }`);
                });

                // asignar los atributros a los campos del dialogo
                // checar si el estatus no es 1 o si hay socio, entonces obtener los invitados del socio para esta reservacion
                // tambien obtener sus numbers de accion
                    
            } catch (error) {
                console.log(`Ha ocurrido un error ${ error }`);
            }
        }
        if (isLoading) {
            getAppointmentData();
            setLoading(false);
        }

        return;
    });


    function changeStartingHole(hole, isChecked) {
        setStartingHole(hole);
        setHoleOneChecked(isChecked);
    }

    function changeMaxPlayers(newMax) {
        setMaxPlayers(newMax);
    }

    const handleClose = () => {
        window.location.reload();
        props.onClose(false);
    }

    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Editar Espacio de Reservación</DialogTitle>
            <DialogContent> 
                <form> 
                    <div>
                        <label>Hora de salida</label>
                        <Datetime 
                            value={startingDate} 
                            onChange={date => setStartingDate(date)} 
                        />
                    </div>
                    <div className="radio">
                        <label>
                            <input
                                type="radio"
                                value={startingHole}
                                checked={holeOneChecked}
                                onChange={hole => changeStartingHole('Hoyo 1', true)}
                            />
                            Hoyo 1
                        </label>
                        <label>
                            <input
                                type="radio"
                                value={startingHole}
                                checked={!holeOneChecked}
                                onChange={hole => changeStartingHole('Hoyo 10', false)}
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
                                defaultValue={maxPlayers}
                                onChange={newMax => changeMaxPlayers(newMax)}
                            />
                            Máximo número de jugadores
                        </label>
                    </div>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit">Actualizar</Button>
                    </DialogActions> 
                </form>
            </DialogContent>
        </Dialog>
    );
}