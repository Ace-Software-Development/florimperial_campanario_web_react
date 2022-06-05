import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import { getAllCoaches, createGolfReservation, getAreaByName, getSitiosByArea } from '../utils/client';
import InputSelector from '../components/InputSelector';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";


export default function CreateGolfAppointmentSlot(props) {
	const [disabledButton, setDisabledButton] = useState(false);
    const [appointment, setAppointment] = useState({
        'fechaInicio': props.startingDate,
        'maximoJugadores': 5,
        'sitio': props.sitios ? props.sitios[0] : {
            'objectId': null,
            'nombre': '',
            'tableName': 'Sitio'
        },
        'profesor': {
            'objectId': null,
            'nombre': '',
            'tableName': 'Profesor'
        }
    });

    useEffect(() => {
        if (props.sitios && props.sitios.length===1) {
            const sitioNewData = {
                'objectId': props.sitios[0].objectId,
                'nombre': props.sitios[0].nombre,
                'tableName': 'Sitio'
            };
            setAppointment({...appointment, sitio: sitioNewData});
        }
    }, []);

    const handleClose = () => {
        props.onClose(false);
    }

    function appointmentOnChange(table, key, data) {
        const updatedAppointment = {...appointment, [key]: data};
        setAppointment(updatedAppointment);
    }

    const onSubmit = async () => {
        // Validations
        // TODO: validate data before sending it

        // Parse data so it matches DB fields
        delete appointment.start;
        delete appointment.title;
        delete appointment.id;
        
        await createGolfReservation(appointment);
        return true;
    }

    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Nuevo espacio de reservación</DialogTitle>
            <DialogContent>

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
                                        input={false}
                                        onChange={date => appointmentOnChange('reservacion', 'fechaInicio', new Date(date.toISOString()))} 
                                    />
                                </td>
                            </tr>

                            {props.sitios && props.sitios.length > 1 &&
								<tr>
									<td>
										<p>Sitio de salida</p>
									</td>
									<td>
										{props.sitios.map(sitio => {
											return(
												<div key={`${sitio.objectId}-sitio-div`}>
													<input
                                                        key={`${sitio.objectId}-sitio-input`}
														type="radio"
														id={sitio.objectId}
														value={sitio.objectId}
														name="sitio"
														defaultChecked={appointment.sitio.objectId === sitio.objectId}
														onChange={event => appointmentOnChange('sitio', {nombre: sitio.nombre, objectId: event.target.value, tableName: 'Sitio'})}
													/>
													<label htmlFor={sitio.objectId}>{sitio.nombre}</label>
												</div>
												);
											})
										}
									</td>
								</tr>
							}

                            <tr>
                                <td>
                                    <p>Máximo asistentes</p>
                                </td>
                                <td>
                                    <input
                                        className='input'
                                        type="number"
                                        min="1"
                                        value={appointment.maximoJugadores}
                                        onChange={event => {
                                            if (event.target.value)
                                                return appointmentOnChange('reservacion', 'maximoJugadores', parseInt(event.target.value));
                                        }} 
                                    />
                                </td>
                            </tr>
                            
							{props.coachInput &&
								<tr>
									<td>
										<p>Coach disponible</p>
									</td>
									<td>
										<InputSelector
											getDisplayText={i => i.nombre}
											getElementId={i => i.objectId}
											placeholder='Nombre del coach'
											defaultValue={appointment.profesor}
											onChange={coach => {appointmentOnChange('recervacion', 'profesor', coach)}}
											getListData={async () => {
												const response = await getAllCoaches();
												const data = [];
												response.forEach(i => {
													data.push({objectId: i.id, nombre: i.get('nombre'), tableName: 'Profesor'});
												});
												return data;
											}}
										/>
									</td>
								</tr>
							}
                        </tbody>
                    </table>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={async () => {
                            if(disabledButton)
                                return;
                            const status = await onSubmit();
                            if (status) {
                                setDisabledButton(true);
                                window.location.reload()
                            }
                        }} type="submit">Crear</Button>
                    </DialogActions> 
            </DialogContent>
        </Dialog>
    );
}
