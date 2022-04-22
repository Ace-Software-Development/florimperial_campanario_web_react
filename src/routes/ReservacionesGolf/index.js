import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function ReservacionesGolf() {
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        async function getGolfAppointments() {
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
                    'startDate': reservaciones[i].get("reservacion").get("fechaInicio"),
                    'reservacion': reservaciones[i].get("reservacion").id,
                });
            }
    
            setAppointments(results);
        }

        getGolfAppointments();

        return;
    }, [appointments.length])

    const handleDateClick = (dateClickInfo) => {
        console.log(dateClickInfo.date);
    }

    return (
        <FullCalendar
            plugins={[daygridPlugin, interactionPlugin]}
            dateClick={handleDateClick}
        />
    )
}