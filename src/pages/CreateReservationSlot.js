import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import { getAllCoaches, createGolfReservation } from '../utils/client';
import InputSelector from '../components/InputSelector';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";


export default function CreateGolfAppointmentSlot(props) {
    const [appointment, setAppointment] = useState({
        'fechaInicio': props.startingDate,
        'maximoJugadores': 5,
        'estatus': 1,
        'sitio': {
            'objectId': 'JH5D3uksh0',
            'nombre': 'Hoyo 1'
        },
        'profesor': {
            'objectId': null,
            'nombre': ''
        }
    });

    const handleClose = () => {
        props.onClose(false);
    }

    function appointmentOnChange(table, key, data) {
        const updatedAppointment = {...appointment, [key]: data};
        setAppointment(updatedAppointment);
    }

    const onSubmit = () => {
        // Parse data so it matches DB fields
        delete appointment.start;
        delete appointment.title;
        delete appointment.id;
        
        createGolfReservation(appointment).then(() => window.location.reload());
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

                            {props.sitios.length > 1 &&
								<tr>
									<td>
										<p>Sitio de salida</p>
									</td>
									<td>
										{props.sitios.map(sitio => {
											return(
												<div>
													<input
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

                            <tr>
                                <td>
                                    <p>Estatus</p>
                                </td>
                                <td>
                                    <select className='input' defaultValue={appointment.estatus} onChange={event => appointmentOnChange('reservacion', 'estatus', parseInt(event.target.value))}>
                                        <option value={1}>Disponible</option>
                                        <option value={2}>Reservado</option>
                                        <option value={3}>Reservado permanente</option>
                                    </select>
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
                        <Button onClick={onSubmit} type="submit">Crear</Button>
                    </DialogActions> 
            </DialogContent>
        </Dialog>
    );
}