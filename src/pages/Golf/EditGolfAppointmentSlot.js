import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import CirculoCarga from "../../components/CirculoCarga";

// import moment from 'moment';

export default function EditGolfAppointmentSlot(props) {
    const [isLoading, setLoading] = useState(true);
    const [golfAppointment, setGolfAppointment] = useState(new Parse.Object("ReservacionGolf"));
    const [appointment, setAppointment] = useState(new Parse.Object("Reservacion"));
    const [user, setUser] = useState(new Parse.Object("_User"));
    // const [invitedToAppointment, setInvitedToAppointment] = useState(new Parse.Object("ReservacionInvitado"));
    const [startingDate, setStartingDate] = useState(new Date());
    const [startingHole, setStartingHole] = useState("");
    const [holeOneChecked, setHoleOneChecked] = useState(false);
    const [maxPlayers, setMaxPlayers] = useState();
    const [reservedKarts, setReservedKarts] = useState(0);
    const [invitedMembers, setInvitedMembers] = useState([]);
    const [invited, setInvited] = useState([]);
    const { register, handleSubmit } = useForm();
    
    async function getAppointmentData() {
        try {
            const appointmentId = String(props.appointmentId);

            const getAppointment = new Parse.Query("ReservacionGolf");            
            getAppointment.include("reservacion");
            getAppointment.include(["reservacion.sitio"]);
            getAppointment.include(["reservacion.user"]);
            // getAppointment.include(["reservacion.user.account"]);
            getAppointment.equalTo("objectId", appointmentId);

            getAppointment.find().then(function(results) {
                return results;
            }).then(function(results) {
                if (results.length === 0) return null;
                
                // 1. Guardar los objetos en variables de estado
                golfAppointment.set("objectId", results[0].id);
                appointment.set("objectId", results[0].get("reservacion").id);
                if (results[0].get("reservacion").get("user") !== undefined) {
                    user.set("objectId", results[0].get("reservacion").get("user").id);
                } else {
                    user.set("username", "");
                }

                // 2. Actualizar las variables de estado de ReservacionGolf con la informacion recopilada
                setStartingDate(results[0].get("reservacion").get("fechaInicio"));
                setMaxPlayers(results[0].get("reservacion").get("maximoJugadores"));
                setStartingHole(results[0].get("reservacion").get("sitio").get("nombre"));
                if (results[0].get("carritosReservados") !== null) {
                    setReservedKarts(results[0].get("carritosReservados"));
                }
                
                // 3. Obtener, si ya alguien reservo, la lista de invitados (socios y no socios) de la reserva y guardarlos
                if (user.objectId === null) return null;
                
                const getGuests = new Parse.Query("ReservacionInvitado");
                getGuests.include("invitado");
                getGuests.include("user");
                getGuests.include(["user.account"]);
                getGuests.equalTo("reservacion", appointment);

                return getGuests.find();
            }).then(function(guests) {
                // for para separar socios de invitados y asignarlos a los arreglos que ya estan
                for (let i = 0; i < guests.length; i++) { 
                    if (guests[i].get("invitado") !== undefined) {
                        invited.push(guests[i].get("invitado"));
                    } else if (guests[i].get("user") !== undefined) {
                        invitedMembers.push(guests[i].get("user"));
                        // checar lo de la cuenta... y el noAccion
                    }
                }
            }, function(error) {
                alert(`Ha ocurrido un error: ${ error }`);
            }); 
            
            
            
        } catch (error) {
            console.log(`Ha ocurrido un error ${ error }`);
        }
        return;
    }
        

    useEffect(async () => {

        try {
            //setLoading(true);
            const appointments = await getAppointmentData();
            setLoading(false);
        } catch(error){
            setLoading(false);
            console.log(error);
        }

    
    }, []);
    
  
    

    function changeStartingHole(hole, isChecked) {
        setStartingHole(hole);
        setHoleOneChecked(isChecked);
    }

    function changeMaxPlayers(newMax) {
        setMaxPlayers(newMax);
    }

    function changeReserveredKarts(newKarts) {
        setReservedKarts(newKarts);
    }

    const handleClose = () => {
       // window.location.reload();
        props.onClose(false);
    }
    
    // 4. Ya que este todo guardado, en editAppointmentSlot() vamos a settear las variables del objeto de ReservacionGolf, Reservacion, ReservacionInvitado
    async function editAppointmentSlot(data) {
        // 5. Guardar cambios de ReservacionGolf
       
        try {
            golfAppointment.set("carritosReservados", reservedKarts);
            golfAppointment.save().then(function(results) {
                return results;
            }).then(function(results) {
                // 6. Guardar cambios de Reservacion
            }).then(function(results) {
                // 7. Guardar cambios de ReservacionInvitado (checar bien cuales socios e invitados se quedan y se van, y si hay invitados nuevos, crearlos en la bd)
            }, function(error) {
                alert(`Ha ocurrido un error ${error}`);
            });            
        } catch (error) {
            alert(`Ha ocurrido un error ${error}`);
        }


        // EXTRA: Checar pases. Una idea es hacer una tabla de pases(fecha, pointer a user, pointer a invitado, usado)
            // Con la tabla ya solamente tenemos que consultar si hay un pase para cierto invitado en cierto dia. No se asigna el pase para actividad sino al dia

        // Ejemplo de funciones anidadas: CreateGolfAppointmentSlot.js
        // BUGS: Desde la vista de mes no se crea bien la reservacion, desde la de dia si. Es por la fecha. Igual en ambas la fecha aparece diferente en el dialogo. 
    }

    const listInvitedMembers = invitedMembers.map((invitedMember) => (
        <div>{ invitedMember.get("username") }</div>
    ));

    const listInvited = invited.map((invited) => (
        <div>{ invited.get("nombre") }</div>
    ));
    
    if (user.get("username") == undefined)
    return (
        <Dialog open={props.open} onClose={handleClose} >
        <DialogTitle>Editar Espacio de Reservación</DialogTitle>
        <DialogContent>     
            <CirculoCarga/>
        </DialogContent>
    </Dialog>

    );
    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Editar Espacio de Reservación</DialogTitle>
            <DialogContent> 
                <form onSubmit={handleSubmit(editAppointmentSlot)}>
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
                            Máximo número de jugadores   
                            <input
                                type="number"
                                min="1"
                                max="5"
                                defaultValue={maxPlayers}
                                onChange={newMax => changeMaxPlayers(newMax)}
                            />
                        </label>
                    </div>
                    <div> 
                        <label>
                            Socio que reservó   :

                            <input
                                type="text"
                                defaultValue={/* user.get("account").get("noAccion") + */ user.get("username")}
                            />
                        </label>
                    </div>
                    <div>
                        <div>Socios invitados:</div>
                        { listInvitedMembers }
                    </div> 
                    <div>
                        <div>No socios invitados:</div>
                        { listInvited }
                    </div>
                    <div>
                        <label>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                defaultValue={reservedKarts}
                                onChange={newKarts => changeReserveredKarts(newKarts)}
                            />
                            Carritos reservados
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