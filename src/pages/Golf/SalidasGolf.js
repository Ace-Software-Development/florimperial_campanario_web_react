import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CreateGolfAppointmentSlot from './CreateGolfAppointmentSlot';
import EditGolfAppointmentSlot from './EditGolfAppointmentSlot';

export default function SalidasGolf() {
    const [appointments, setAppointments] = useState([]);
    const [newSlotStart, setNewSlotStart] = useState("");
    const [editAppointmentId, setEditAppointmentId] = useState("");
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
       async function getGolfAppointments() {
            try {
                const query = new Parse.Query('ReservacionGolf');
                query.include("reservacion");
                query.include(["reservacion.user"]);
                query.include(["reservacion.sitio"]);

                const reservaciones = await query.find();
                const resultados = new Array(0);

                for (let i = 0; i < reservaciones.length; i++) {
                    let title = '';

                    if (!reservaciones[i].get("reservacion").get("user")) {
                        title = 'Disponible';
                    } else {
                        title = reservaciones[i].get("reservacion").get("user").get("username");
                    }
                    
                    resultados.push({
                        'id': reservaciones[i].id,
                        'title': title,
                        'start': reservaciones[i].get("reservacion").get("fechaInicio"),
                        'hole': reservaciones[i].get("reservacion").get("sitio").get("nombre"),
                        'status': reservaciones[i].get("reservacion").get("estatus")
                    })                    
                }

                setAppointments(resultados);
           } catch (error) {
               console.log(`Ha ocurrido un error: ${ error }`);
           }
        }
        
        getGolfAppointments();

        return;
    }, [appointments.length])

    const addAppointmentSlot = (dateClickInfo) => {
        setNewSlotStart(dateClickInfo.dateStr);
        setOpenCreate(true);
    }

    const editAppointment = (eventClick) => {
        setEditAppointmentId(eventClick.event._def.publicId);
        setOpenEdit(true);
    }

    if (openCreate) {
        return(
            <div>
                <FullCalendar
                    dateClick={addAppointmentSlot}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
                    initialView='dayGridMonth'
                    events={appointments}
                    eventClick={editAppointment}
                    />
                <CreateGolfAppointmentSlot 
                    open={openCreate} 
                    onClose={setOpenCreate}
                    startingDate={newSlotStart}
                    />
            </div>
        );
    }

    if (openEdit) {
        return(
            <div>
                <FullCalendar
                    dateClick={addAppointmentSlot}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
                    initialView='dayGridMonth'
                    events={appointments}
                    eventClick={editAppointment}
                    />
                <EditGolfAppointmentSlot 
                    open={openEdit} 
                    onClose={setOpenEdit}
                    appointmentId={editAppointmentId}
                    />
            </div>
        );
    }

    return (
        <div>
            <FullCalendar
                dateClick={addAppointmentSlot}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
                initialView='dayGridMonth'
                events={appointments}
                eventClick={editAppointment}
                />
        </div>
    );
}