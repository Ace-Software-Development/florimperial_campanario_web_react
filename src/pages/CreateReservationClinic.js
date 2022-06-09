import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import CirculoCarga from '../components/CirculoCarga';
import InputSelector from '../components/InputSelector';
import { getAllCoaches } from '../utils/client';
import Datetime from 'react-datetime';


export default function CreateReservationClinic(props) {
	const [loading, setLoading] = useState(true);
	const [disabledButton, setDisabledButton] = useState(false);
	const [clinicData, setClinicData] = useState({
		nombre: '',
		maximoJugadores: 5,
		horario: '12:00',
		fechaInicio: new Date(),
		fechaFin: new Date(),
		dias: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'],
		socios : [],
		sitio: {
			objectId: null,
			nombre: '',
			tableName: 'Sitio',
		}
	});

	useEffect(() => {
		if (props.sitios) {
			setLoading(false);
			const sitioNewData = {
                'objectId': props.sitios[0].objectId,
                'nombre': props.sitios[0].nombre,
                'tableName': 'Sitio'
            };
			setClinicData({...clinicData, sitio: sitioNewData});
		}
	}, [props.sitios]);

	const clinicOnChange = (key, value) => {
		const updatedAppointment = {...clinicData, [key]: value};
        setClinicData(updatedAppointment);
	}

	const onSubmit = () => {
		// Validations
        //await createGolfReservation(appointment);
        return true;
	}

	if (!loading)
		return (
			<Dialog open={props.open} onClose={() => props.onClose(false)}>
				<DialogTitle>Nueva clínica</DialogTitle>
				<DialogContent>
					<DialogActions>

						<table>
                            <tbody>
                                <tr>
                                    <td>
                                        <p>Fecha de inicio</p>
                                    </td>
                                    <td>
                                        <Datetime
                                            inputProps={{className:'input'}}
                                            initialValue={clinicData.fechaInicio}
                                            input={false}
                                            onChange={date => clinicOnChange('reservacion', 'fechaInicio', new Date(date.toISOString()))} 
                                        />
                                    </td>
                                </tr>

								<tr>
                                    <td>
                                        <p>Fecha a terminar</p>
                                    </td>
                                    <td>
                                        <Datetime
                                            inputProps={{className:'input'}}
                                            initialValue={clinicData.fechaInicio}
                                            input={false}
                                            onChange={date => clinicOnChange('reservacion', 'fechaInicio', new Date(date.toISOString()))} 
                                        />
                                    </td>
                                </tr>

                                {props.sitios && props.sitios.length > 1 &&
                                    <tr>
                                        <td>
                                            <p>Sitio</p>
                                        </td>
                                        <td>
                                            {props.sitios.map((sitio, index) => {
                                                return(
                                                    <div key={`${sitio.objectId}-sitio-div`}>
                                                        <input
                                                            key={`${sitio.objectId}-sitio-input`}
                                                            type="radio"
                                                            id={sitio.objectId}
                                                            value={sitio.objectId}
                                                            name="sitio"
                                                            defaultChecked={index === 0}
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
                                        <p>Máximo de asistentes</p>
                                    </td>
                                    <td>
                                        <input
                                            className='input'
                                            type="number"
                                            min="1"
                                            value={clinicData.maximoJugadores}
                                            onChange={event => {
                                                if (event.target.value)
                                                    return clinicOnChange('maximoJugadores', parseInt(event.target.value));
                                            }} 
                                        />
                                    </td>
                                </tr>
                                
                                {props.coachInput &&
                                    <tr>
                                        <td>
                                            <p>Profesor responsable</p>
                                        </td>
                                        <td>
                                            <InputSelector
                                                getDisplayText={i => i.nombre}
                                                getElementId={i => i.objectId}
                                                placeholder='Nombre del coach'
                                                defaultValue={clinicData.profesor}
                                                onChange={coach => {clinicOnChange('profesor', coach)}}
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

						<Button onClick={() => props.onClose(false)}>Cancelar</Button>
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
	else
		return (
            <CirculoCarga />
        );
}