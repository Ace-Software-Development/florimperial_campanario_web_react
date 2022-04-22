import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import SaveGolfAppointment from './saveGolfAppointment';

export default function ReservacionesGolf() {
    const [openSave, setOpenSave] = useState(false);
    const [appointments, setAppointments] = useState([])

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
                    results.push({
                        'id': reservaciones[i].id,
                        'title': reservaciones[i].get("reservacion").get("socio").get("nombre"), 
                        'date': reservaciones[i].get("reservacion").get("fechaInicio"),
                        'reservacion': reservaciones[i].get("reservacion").id,
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

    return (
        <div>
            <FullCalendar
                plugins={[daygridPlugin, interactionPlugin]}
                dateClick={handleDateClick}
                events={appointments}
                dayCellContent={injectCellContent}
            />
            <SaveGolfAppointment open={openSave} onClose={setOpenSave} />
        </div>
    )
}