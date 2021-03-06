// W28
import React, { useEffect, useState, createRef } from 'react';
import { getAllClinicsReservations, deleteClinic, updateClinicsReservations, getReservacionClinica } from '../utils/client';
import { toYYMMDD } from '../utils/dateHelpers';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ClinicUsers from '../components/ClinicUsers';
import { DialogContent, DialogActions } from '@mui/material';
import CirculoCarga from '../components/CirculoCarga';
import { Button } from '@mui/material';
import '../css/Clinics.css';


export default function EditReservationClinic(props) {
	const [clinic, setClinic] = useState({...props.clinicData, dias: Object.keys(props.clinicData.dias).filter(key => props.clinicData.dias[key])}); 
	const [users, setUsers] = useState([]);
	const [disabledButton, setDisabledButton] = useState(false);
	const [deleteDisabledButton, setDeleteDisabledButton] = useState(false);

    useEffect(async () => {
        getReservacionClinica(props.clinicData.objectId).then(response => {
            let data = [];
            response.forEach(i => {
                const usersData = {id: i.get('user').id, username: i.get('user').get('username')}
                data.push(usersData);
            });
            setUsers(data);
        });
    }, []);

	const handleClose = () => {
		props.onClose(false);
	}

	const clinicOnChange = (key, data) => {
        if (key === 'dias') {
            data = clinic.dias.includes(data) ? clinic.dias.filter(x => x!==data) : [...clinic.dias, data];
        }
        const updatedClinic = {...clinic, [key]: data};
		setClinic(updatedClinic);
	}

	const handleDelete = async () => {
		await deleteClinic(clinic);
		return true;
	}

	const onSubmit = async () => {
        const diasObj = {LUNES:false, MARTES:false, MIERCOLES:false, JUEVES:false, VIERNES:false, SABADO:false}
        clinic.dias.forEach(dia => {
            diasObj[dia] = true;
        });
        const clinicCopy = {...clinic, dias: diasObj};
        await updateClinicsReservations(clinicCopy, users);
        return true;
	}

	return (
		<Dialog open={props.open} onClose={handleClose} fullWidth={true} maxWidth="md">
			<DialogTitle>Editar Clinica</DialogTitle>
			<DialogContent>
				<div className="reservations-container">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <p>Fecha de inicio</p>
                                </td>
                                <td>
                                    <input 
                                        type="date"
                                        value={toYYMMDD(clinic.fechaInicio)}
                                        onChange={date => clinicOnChange('fechaInicio', new Date(date.target.value))} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p>Fecha de finalizaci??n</p>
                                </td>
                                <td>
                                    <input 
                                        type="date"
                                        value={toYYMMDD(clinic.fechaFin)}
                                        onChange={date => clinicOnChange('fechaFin', new Date(date.target.value))} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p>Horario</p>
                                </td>
                                <td>
                                    <input type="time"
                                        value={clinic.horario}
                                        onChange={time => clinicOnChange('horario', time.target.value)} />
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
                                                <div key={`${sitio.objectId}-sitio-div`}>
                                                    <input
                                                        key={`${sitio.objectId}-sitio-input`}
                                                        type="radio"
                                                        id={sitio.objectId}
                                                        value={sitio.objectId}
                                                        name="sitio"
                                                        defaultChecked={clinic.sitio.objectId === sitio.objectId}
                                                        onChange={event => clinicOnChange('sitio', {nombre: sitio.nombre, objectId: event.target.value, tableName: 'Sitio'})}
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
                                    <p>D??as a la semana</p>
                                </td>
                                <td>
                                    <div className="clinic-dias">
                                        <div>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value="LUNES"
                                                    defaultChecked={clinic.dias.includes("LUNES")}
                                                    onChange={e => clinicOnChange('dias', e.target.value)} 
                                                />
                                                Lunes
                                            </label>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    value="MARTES"
                                                    defaultChecked={clinic.dias.includes("MARTES")}
                                                    onChange={e => clinicOnChange('dias', e.target.value)} 
                                                />
                                                Martes
                                            </label>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    value="MIERCOLES"
                                                    defaultChecked={clinic.dias.includes("MIERCOLES")}
                                                    onChange={e => clinicOnChange('dias', e.target.value)} 
                                                />
                                                Mi??rcoles
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    value="JUEVES"
                                                    defaultChecked={clinic.dias.includes("JUEVES")}
                                                    onChange={e => clinicOnChange('dias', e.target.value)} 
                                                />
                                                Jueves
                                            </label>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    value="VIERNES"
                                                    defaultChecked={clinic.dias.includes("VIERNES")}
                                                    onChange={e => clinicOnChange('dias', e.target.value)} 
                                                />
                                                Viernes
                                            </label>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    value="SABADO"
                                                    defaultChecked={clinic.dias.includes("SABADO")}
                                                    onChange={e => clinicOnChange('dias', e.target.value)} 
                                                />
                                                S??bado
                                            </label>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p>M??ximo asistentes</p>
                                </td>
                                <td>
                                    <input
                                        className='input'
                                        type="number"
                                        min="1"
                                        value={clinic.maximoJugadores}
                                        onChange={event => {
                                                clinicOnChange('maximoJugadores', parseInt(event.target.value));
                                            }
                                        } 
                                    />
                                </td>
                            </tr>

                        </tbody>
                    </table>
                    
                    {/* Same logic for multiple users reservations as for guests */}
                    <ClinicUsers 
                        maxUsers={clinic.maximoJugadores} 
                        users={users} 
                        setUsers={setUsers} 
                        reservationId={clinic.objectId} 
                    />
				</div>
				<DialogActions>
					<Button onClick={handleClose}>Cancelar</Button>
					<Button onClick={async () => {
						if (deleteDisabledButton)
							return;
						const status = await handleDelete();
						if (status) {
							setDeleteDisabledButton(true);
							window.location.reload();
						}
					}}>Eliminar</Button>
					<Button onClick={async () => {
						if(disabledButton)
							return;
						const status = await onSubmit();
						if (status) {
							setDisabledButton(true);
							window.location.reload();
						}
					}} type="submit">Actualizar</Button>
				</DialogActions> 
			</DialogContent>
		</Dialog>
	);
}