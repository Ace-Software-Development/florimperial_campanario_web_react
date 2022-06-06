import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function GolfSalidas() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        getGolfAppointments
    })

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'today prev,next',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                views={{
                    dayGridMonth: {
                        buttonText: "Mes"
                    },
                    timeGridWeek: {
                        buttonText: "Semana"
                    },
                    timeGridDay: {
                        buttonText: "Día"
                    },
                }}
                events={appointments}
            />
        </div>
    );
}