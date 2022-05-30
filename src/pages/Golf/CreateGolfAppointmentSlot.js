import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import { getAllCoaches } from '../../utils/client';
import InputSelector from '../../components/InputSelector';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";


export default function CreateGolfAppointmentSlot(props) {
    const [appointment, setAppointment] = useState(props.appointmentData);

    const handleClose = () => {
        props.onClose(false);
    }

    function appointmentOnChange(table, key, data) {
        const updatedAppointment = {...appointment, key: data};
        // To implement
    }


    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Nuevo espacio de reservación</DialogTitle>
            <DialogContent> 
                <form>
                    <table>
                        <tbody>

                            <tr>
                                <td>
                                    <p>Fecha y hora</p>
                                </td>
                                <td>
                                    <Datetime
                                        inputProps={{className:'input'}}
                                        initialValue={props.startingDate}
                                        onChange={date => appointmentOnChange('reservacion', 'fechaInicio', new Date(date.toISOString()))} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Sitio de salida</p>
                                </td>
                                <td>
                                    <div>
                                        <input
                                            type="radio"
                                            value="Hoyo 1"
                                            name="sitio"
                                            defaultChecked={true}
                                            onChange={event => appointmentOnChange('reservacion', 'sitio', event.target.value)}
                                        />
                                        <label>Hoyo 1</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            value="Hoyo 10"
                                            name="sitio"
                                            onChange={event => appointmentOnChange('reservacion', 'sitio', event.target.value)} 
                                            />
                                        <label>Hoyo 10</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            value="Tee"
                                            name="sitio"
                                            onChange={event => appointmentOnChange('reservacion', 'sitio', event.target.value)} 
                                            />
                                        <label>Tee de práctica</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Máximo asistentes</p>
                                </td>
                                <td>
                                    <input
                                        className='input'
                                        type="number"
                                        min="1"
                                        defaultValue={5}
                                        onChange={event => appointmentOnChange('reservacion', 'maximoJugadores', event.target.value)} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Coach disponible</p>
                                </td>
                                <td>
                                    <InputSelector
                                        getDisplayText={i => i.nombre}
                                        getElementId={i => i.id}
                                        placeholder='Nombre del coach'
                                        onChange={coach => appointmentOnChange('recervacion', 'profesor', coach)}
                                        getListData={async () => {
                                            const response = await getAllCoaches();
                                            const data = [];
                                            response.forEach(i => {
                                                data.push({id: i.id, nombre: i.get('nombre')});
                                            });
                                            return data;
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit">Crear</Button>
                    </DialogActions> 
                </form>
            </DialogContent>
        </Dialog>
    );
}