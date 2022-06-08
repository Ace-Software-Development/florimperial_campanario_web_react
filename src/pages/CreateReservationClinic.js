import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import CirculoCarga from '../components/CirculoCarga';
import InputSelector from '../components/InputSelector';


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
			setAppointment({...clinicData, sitio: sitioNewData});
		}
	}, [props.sitios]);

	const handleClose = () => {}

	const onSubmit = () => {}

	if (!loading)
		return (
			<Dialog open={props.open} onClose={handleClose}>
				<DialogTitle>Nueva clínica</DialogTitle>
				<DialogContent>
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
	else
		return (
            <CirculoCarga />
        );
}