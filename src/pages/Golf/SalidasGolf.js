import React, { useEffect, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CreateGolfAppointmentSlot from './CreateGolfAppointmentSlot';
import EditGolfAppointmentSlot from './EditGolfAppointmentSlot';
import esLocale from '@fullcalendar/core/locales/es';
import CirculoCarga from "../../components/CirculoCarga";
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

		for (let i = 0; i < appointments.length; i++) {
			let title = '';

			if (appointments[i].get("estatus") == 1) {
				title = 'Disponible';
			} else {
				title = appointments[i].get("user").get("username");
			}
            console.log(appointments[i].get('fechaInicio'))
			resultados.push({
				'id': appointments[i].id,
				'title': title,
				'start': appointments[i].get("fechaInicio"),
				'hole': appointments[i].get("sitio").get("nombre")
			})
		}
        setAppointments(resultados);
        setLoading(false);
        return;
    }, [])

    const addAppointmentSlot = (dateClickInfo) => {
        let selectedDate = (dateClickInfo.dateStr);
        if  (selectedDate.length === 10 ){
        
            selectedDate+="T00:00:00-05:00";
        }
        setNewSlotStart(selectedDate);
        setOpenCreate(true);
    }

    const editAppointment = (eventClick) => {
        const id = eventClick.event._def.publicId;
        setSelectedAppointment(appointments.filter(row => row.id == id)[0]);
        setOpenEdit(true);
    }

    if (loading)
    return (   <CirculoCarga/>);
    if (openCreate) {
        return(
            <div>
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
                <script src='fullcalendar/lang/es.js'></script>
                <EditGolfAppointmentSlot 
                    open={openEdit} 
                    onClose={setOpenEdit}
                    appointmentData={selectedAppointment}
                    />
            </div>
        );
    }

    return (
        <div>
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
        </div>
    );
}