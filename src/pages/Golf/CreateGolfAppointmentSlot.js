import React, { useState } from 'react';
import Parse from 'parse';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';

export default function CreateGolfAppointmentSlot(props) {
    const [startingDate, setStartingDate] = useState(new Date(props.startingDate));
    const [startingHole, setStartingHole] = useState("Hoyo 1");
    const [holeOneChecked, setHoleOneChecked] = useState(true);
    const [maxPlayers, setMaxPlayers] = useState(2);
    const { register, handleSubmit } = useForm();

    function changeStartingHole(hole, isChecked) {
        setStartingHole(hole);
        setHoleOneChecked(isChecked);
    }

    function changeMaxPlayers(newMax) {
        setMaxPlayers(newMax);
    }

    const handleClose = () => {
        //window.location.reload();
        props.onClose(false);
    }

    async function createAppointmentSlot(data) {
        const momentStartingDate = moment(startingDate).toDate();
        const numberMaxPlayers = Number(maxPlayers);

        try {
            const getAppointmentsAtSameHour = new Parse.Query('Reservacion');
            getAppointmentsAtSameHour.include("sitio");
            getAppointmentsAtSameHour.equalTo("fechaInicio", momentStartingDate);

            getAppointmentsAtSameHour.find().then(function(results) {
                return results;
            }).then(function(results) {
                if (results.length > 0) {
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].get("sitio").get("nombre") === startingHole) {
                            alert(`Ya existe una reservación en ese horario y saliendo del ${ startingHole }`);
                            return null;
                        }
                    }
                }
                
                const getSitios = new Parse.Query('Sitio');
                getSitios.equalTo("nombre", startingHole);

                return getSitios.find();
            }).then(function(sitios) {
                if (!sitios) return null;

                const Reservacion = Parse.Object.extend("Reservacion");
                const reservacion = new Reservacion();
                
                reservacion.set("fechaInicio", momentStartingDate);
                reservacion.set("sitio", sitios[0]);
                reservacion.set("maximoJugadores", numberMaxPlayers);
                reservacion.set("estatus", 1);
                
                return reservacion.save(); 
            }).then(function(reservacionId) {
                if (!reservacionId) return null;

                const ReservacionGolf = Parse.Object.extend("ReservacionGolf");
                const reservacionGolf = new ReservacionGolf();
                
                reservacionGolf.set("reservacion", reservacionId);

                return reservacionGolf.save();
            }).then(function(reservacionGolfId) {
                if (!reservacionGolfId) return null;

                alert(`La reservación se ha creado correctamente.`);
                handleClose();
            }, function (error) {
               alert(`Ha ocurrido un error: ${ error }`);
           });
        } catch (error) {
            console.log(`Ha ocurrido un error: ${ error }`)
        }
    }

    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Nuevo espacio de reservación</DialogTitle>
            <DialogContent> 
                <form onSubmit={handleSubmit(createAppointmentSlot)}> 
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
                        <Button type="submit">Crear</Button>
                    </DialogActions> 
                </form>
            </DialogContent>
        </Dialog>
    );
}