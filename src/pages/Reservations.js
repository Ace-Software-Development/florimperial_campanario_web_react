// W8 W9 W10
import React, { useEffect, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CreateReservationSlot from './CreateReservationSlot';
import esLocale from '@fullcalendar/core/locales/es';
import Screen from "../components/Screen";
import EditReservation from './EditReservation';

export default function Reservations(props) {
    const [newSlotStart, setNewSlotStart] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    
    const addAppointmentSlot = (dateClickInfo) => {
        setNewSlotStart(dateClickInfo.date);
        setOpenCreate(true);
    }

    const editAppointment = (eventClick) => {
        const id = eventClick.event._def.publicId;
        setSelectedAppointment(props.reservationsData.find(row => row.objectId == id));
        setOpenEdit(true);
    }

    return (
        <Screen title={props.screenTitle} screenPath={props.screenPath} >
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
                events={props.reservationsData}
                eventClick={editAppointment}
            />

            { openEdit &&
				<EditReservation 
					open={openEdit}
					onClose={setOpenEdit}
					appointmentData={selectedAppointment}
					coachInput={props.coachInput}
					sitios={props.sitios}
				/>
            }

            { openCreate &&
                <CreateReservationSlot 
                    open={openCreate} 
                    onClose={setOpenCreate}
                    startingDate={newSlotStart}
					coachInput={props.coachInput}
					sitios={props.sitios}
                />
            }
        </Screen>
    );
}