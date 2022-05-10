import React, { useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function SalidasGolf() {
    const [appointments, setAppointments] = useState([]);

    return (
        <div>
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            views={{
                customMonth : {
                    buttonText : 'Mes'
                },
                customWeek : {
                    buttonText : 'Semana'
                },
                customDay : {
                    buttonText : 'Día'
                }
            }}
            headerToolbar={{
                left: 'today prev,next',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,timeGridDay'
            }}
            initialView='timeGridDay'
            events={appointments}
            />
        </div>
    );
}