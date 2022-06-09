import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import CirculoCarga from '../components/CirculoCarga';
import InputSelector from '../components/InputSelector';
import { getAllCoaches, createReservationClinic } from '../utils/client';


export default function CreateReservationClinic(props) {
	const [loading, setLoading] = useState(true);
	const [disabledButton, setDisabledButton] = useState(false);
	const [clinicData, setClinicData] = useState({
		nombre: '',
		maximoJugadores: 5,
		horario: null,
		fechaInicio: null,
		fechaFin: null,
		dias: [],
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
        if (key === 'dias') {
            value = clinicData.dias.includes(value) ? clinicData.dias.filter(x => x!==value) : [...clinicData.dias, value];
        }
		const updatedAppointment = {...clinicData, [key]: value};
        setClinicData(updatedAppointment);
	}

	const onSubmit = async () => {
		// Validations
        if (!clinicData.nombre)
            return false;
        if (!clinicData.horario)
            return false;
        if (clinicData.dias.length < 1)
            return false;
        if (!clinicData.maximoJugadores)
            return false;

        // Change dias array to object
        const diasObj = {LUNES:false, MARTES:false, MIERCOLES:false, JUEVES:false, VIERNES:false, SABADO:false}
        clinicData.dias.forEach(dia => {
            diasObj[dia] = true;
        })
        clinicData.dias = diasObj;
        await createReservationClinic(clinicData);
        return true;
	}

	if (!loading)
		return (
			<Dialog open={props.open} onClose={() => props.onClose(false)}>
				<DialogTitle>Nueva clínica</DialogTitle>
				<DialogContent>

                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <p>Nombre de la clase</p>
                                </td>
                                <td>
                                    <input type="text" className="input" placeholder="Yoga matutina..."
                                        onChange={e => clinicOnChange('nombre', e.target.value)} 
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p>Hora</p>
                                </td>
                                <td>
                                    <input type="time" className="input"
                                        min="06:00" max="22:00"
                                        onChange={e => clinicOnChange('horario', e.target.value)} 
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p>Fecha de inicio</p>
                                </td>
                                <td>
                                    <input type="date" className="input"
                                        onChange={e => clinicOnChange('fechaInicio', new Date(e.target.value))} 
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p>Fecha a terminar</p>
                                </td>
                                <td>
                                    <input type="date" className="input"
                                        onChange={e => clinicOnChange('fechaFin', new Date(e.target.value))} 
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p>Días a la semana</p>
                                </td>
                                <td>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value="LUNES"
                                            onChange={e => clinicOnChange('dias', e.target.value)} 
                                        />
                                        Lunes
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            value="MARTES"
                                            onChange={e => clinicOnChange('dias', e.target.value)} 
                                        />
                                        Martes
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            value="MIERCOLES"
                                            onChange={e => clinicOnChange('dias', e.target.value)} 
                                        />
                                        Miércoles
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            value="JUEVES"
                                            onChange={e => clinicOnChange('dias', e.target.value)} 
                                        />
                                        Jueves
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            value="VIERNES"
                                            onChange={e => clinicOnChange('dias', e.target.value)} 
                                        />
                                        Viernes
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            value="SABADO"
                                            onChange={e => clinicOnChange('dias', e.target.value)} 
                                        />
                                        Sábado
                                    </label>
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
                                    <p>Cupo máximo</p>
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

					<DialogActions>
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