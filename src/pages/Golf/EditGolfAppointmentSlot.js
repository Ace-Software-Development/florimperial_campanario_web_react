import React, { useState } from 'react';
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
    const [firstOpen, setFirstOpen] = useState(true);
    const [appointment, setAppointment] = useState();
    const [startingDate, setStartingDate] = useState(new Date());
    const [startingHole, setStartingHole] = useState("");
    const [holeOneChecked, setHoleOneChecked] = useState(false);
    const [maxPlayers, setMaxPlayers] = useState();
    // const { register, handleSubmit } = useForm();
    
    if (firstOpen) {
        getAppointmentData();
        setFirstOpen(false);
    }

    async function getAppointmentData() {
        try {
            const appointmentId = String(props.appointmentId);

            const getAppointment = Parse.Query('ReservacionGolf');
            getAppointment.include("reservacion");
            getAppointment.equalTo("id", appointmentId);

            const results = await getAppointment.find();
            console.log(results);
        } catch (error) {
            console.log(`Ha ocurrido un error ${ error }`);
        }

        return;
    }

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
                        <Button type="submit">Crear</Button>
                    </DialogActions> 
                </form>
            </DialogContent>
        </Dialog>
    );
}