import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import Parse from 'parse';
import moment from 'moment';

export default function (props) {
    let [start, setStart] = useState(new Date());
    const [hoyoSalida, setHoyoSalida] = useState("Hoyo 1");
    const { register, handleSubmit } = useForm();
    const [hoyoUnoChecked, setHoyoUnoChecked] = useState(true);

    const handleClose = () => {
        props.onClose(false);
    }

    async function handleData(data) {
        try {
            const getSitio = new Parse.Query('Sitio');
            getSitio.equalTo("nombre", hoyoSalida);

            getSitio.find().then(function(sitio) {
                return sitio;
            }).then(function(results) {
                const Reservacion = Parse.Object.extend("Reservacion");
                const reservacion = new Reservacion();
                
                const horaSalida = moment(start).toDate();
                const maximoJugadores = Number(document.getElementById('maximoJugadores').value);

                reservacion.set("fechaInicio", horaSalida);
                reservacion.set("sitio", results[0]);
                reservacion.set("maximoJugadores", maximoJugadores);
                reservacion.set("estatus", 1);
                
                return reservacion.save();
            }).then(function(result) {
                alert('La reservación se creó correctamente.');
                handleClose();
            }, function(error) {
                alert(error);
            });
        } catch (error) {
            console.log(`Ha ocurrido un error: ${ error }`);
        }
    }

    function changeHoyoSalida(hoyo, isChecked) {
        setHoyoSalida(hoyo);
        setHoyoUnoChecked(isChecked);
    }

    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Prueba de Arquitectura</DialogTitle>
            <DialogContent> 
                <form onSubmit={handleSubmit(handleData)}> 
                    <div>
                        <label>Hora de salida</label>
                        <Datetime value={start} onChange={date => setStart(date)} />
                    </div>
                    <div className="radio">
                        <label>
                            <input
                                type="radio"
                                value={hoyoSalida}
                                checked={hoyoUnoChecked}
                                onChange={hoyo => changeHoyoSalida('Hoyo 1', true)}
                            />
                            Hoyo 1
                        </label>
                        <label>
                            <input
                                type="radio"
                                value={hoyoSalida}
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
                                id="maximoJugadores"
                                min="1"
                                max="5"
                                defaultValue={"2"}
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
    )
}