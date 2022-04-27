import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import SaveGolfAppointment from './saveGolfAppointment';
import EditGolfAppointment from './editGolfAppointment';

export default function ReservacionesGolf() {
    const [openSave, setOpenSave] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState('');
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        async function getGolfAppointments() {
            try {
                const query = new Parse.Query('ReservacionGolf');
                query.include("reservacion");
                query.include(["reservacion.socio"]);
                query.include(["reservacion.sitio"]);

                const reservaciones = await query.find();
                const results = new Array();
            
                for (var i = 0; i < reservaciones.length; i++) {
                    let title = '';
                    
                    if (!reservaciones[i].get("reservacion").get("socio")) {
                        title = 'Disponible';
                    } else {
                        title = reservaciones[i].get("reservacion").get("socio").get("nombre");
                    }

                    results.push({
                        'id': reservaciones[i].id,
                        'title': title,
                        'reservacion': reservaciones[i].get("reservacion").id,
                        'date': reservaciones[i].get("reservacion").get("fechaInicio"),
                        'socio': reservaciones[i].get("reservacion").get("socio"),
                        'maximoJugadores': reservaciones[i].get("reservacion").get("maximoJugadores"),
                        'hoyoSalida': reservaciones[i].get("reservacion").get("sitio"),
                    });
                }

                setAppointments(results);
            } catch (error) {
                console.log(`Ha ocurrido un error: ${ error }`);
            }
        }

        getGolfAppointments();

        return;
    }, [appointments.length])

    const handleDateClick = (dateClickInfo) => {
        console.log(dateClickInfo.date);
    }

    const injectCellContent = (args) => {
        return (
            <div>
                <button onClick={() => saveRecord(args.date)}>
                    {args.dayNumberText}
                </button>
            </div> 
        )
    }

    const saveRecord = (date) => {
        setOpenSave(true);
    }

    const editAppointment = (eventClick) => {
        const data = [ 
            'Pasando al hijo',
            'k82n9v8apif'
        ]
        setEditData(data);
        setOpenEdit(true);
        // tal vez buscar el objeto en el array... y ya obtenerlo...
    }

    return (
        <div>
            <FullCalendar
                plugins={[daygridPlugin, interactionPlugin]}
                dateClick={handleDateClick}
                events={appointments}
                dayCellContent={injectCellContent}
                eventClick={editAppointment}   
            />
            <SaveGolfAppointment open={openSave} onClose={setOpenSave} />
            <EditGolfAppointment open={openEdit} onClose={setOpenEdit} parentToChild={editData} />
        </div>
    )
}