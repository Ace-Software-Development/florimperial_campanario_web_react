import React, { useEffect, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CreateGolfAppointmentSlot from './CreateGolfAppointmentSlot';
import EditGolfAppointmentSlot from './EditGolfAppointmentSlot';
import esLocale from '@fullcalendar/core/locales/es';
import CirculoCarga from "../../components/CirculoCarga";
import Screen from "../../components/Screen";
import {getAllGolfAppointmentSlots} from '../../utils/client';

export default function SalidasGolf() {
    const [appointments, setAppointments] = useState([]);
    const [newSlotStart, setNewSlotStart] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(async() => {
        setLoading(true);
        const appointments = await getAllGolfAppointmentSlots();
        const resultados = [];
		appointments.forEach( appointment => {
			resultados.push({
				'id': appointment.id,
				'title': appointment.get("estatus") == 1 ? 'Disponible' : appointment.get("user").get("username"),
				'start': appointment.get("fechaInicio"),
				'estatus': appointment.get("estatus"),
				'sitio': appointment.get("sitio").get('nombre'),
				'maximoJugadores': appointment.get("maximoJugadores"),
                'hole': {
                    'id': appointment.get("sitio").id,
                    'nombre': appointment.get("sitio").get("nombre")
                },
                'profesor': appointment.get('profesor') ? {
                    'id': appointment.get('profesor').id,
                    'nombre': appointment.get('profesor').get('nombre')
                } : null,
				'user': appointment.get('user') ? {
                    'id': appointment.get('user').id,
                    'username': appointment.get('user').get('username')
                } : null
			})
        });
        setAppointments(resultados);
        setLoading(false);
        return;
    }, [])

    const addAppointmentSlot = (dateClickInfo) => {
        setNewSlotStart(dateClickInfo.date);
        setOpenCreate(true);
    }

    const editAppointment = (eventClick) => {
        const id = eventClick.event._def.publicId;
        setSelectedAppointment(appointments.filter(row => row.id == id)[0]);
        setOpenEdit(true);
    }

    if (loading)
        return <CirculoCarga/>;

    return (
        <Screen title='Reservaciones de Golf'>
            <FullCalendar
                locale={esLocale}
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

            { openEdit &&
                <div>
                    <script src='fullcalendar/lang/es.js'></script>
                    <EditGolfAppointmentSlot 
                        open={openEdit} 
                        onClose={setOpenEdit}
                        appointmentData={selectedAppointment}
                    />
                </div>
            }

            { openCreate &&
                <CreateGolfAppointmentSlot 
                    open={openCreate} 
                    onClose={setOpenCreate}
                    startingDate={newSlotStart}
                />
            }
        </Screen>
    );
}