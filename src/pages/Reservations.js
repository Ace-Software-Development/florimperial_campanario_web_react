// W8 W9 W10
import React, { useEffect, useState, createRef } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CreateReservationSlot from './CreateReservationSlot';
import esLocale from '@fullcalendar/core/locales/es';
import Screen from "../components/Screen";
import EditReservation from './EditReservation';
import { getAllAvailableReservations } from '../utils/client';
import CirculoCarga from '../components/CirculoCarga';
import '../css/Reservations.css';


export default function Reservations(props) {
    const [newSlotStart, setNewSlotStart] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [reservationsData, setReservationsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        setLoading(true);
        const data = await getAllAvailableReservations(props.module);
        setReservationsData(data);
        setLoading(false);
    }, []);
  
    const addAppointmentSlot = (dateClickInfo) => {
        setNewSlotStart(dateClickInfo.date);
        setOpenCreate(true);
    }

    const editAppointment = (eventClick) => {
        const id = eventClick.event._def.publicId;
        setSelectedAppointment(reservationsData.find(row => row.objectId == id));
        setOpenEdit(true);
    }
    
    if (loading){
          return (
            <Screen title={props.screenTitle} screenPath={props.screenPath}>
                <CirculoCarga />
            </Screen>
        );
      
    }
    else{
          return (
              
            <Screen title={props.screenTitle} screenPath={props.screenPath} >
                <div className="reservations-padding">
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
                    events={reservationsData}
                    eventClick={editAppointment}
                />

                { openEdit &&
                    <EditReservation 
                        open={openEdit}
                        onClose={setOpenEdit}
                        appointmentData={selectedAppointment}
                        coachInput={props.coachInput}
                        guestsInput={props.guestsInput}
                        sitios={props.sitios}
                    />
                }

                { openCreate &&
                    <CreateReservationSlot 
                        open={openCreate} 
                        onClose={setOpenCreate}
                        startingDate={newSlotStart}
                        coachInput={props.coachInput}
                        guestsInput={props.guestsInput}
                        sitios={props.sitios}
                    />
                }
                </div>
            </Screen>
        );
    }
} 