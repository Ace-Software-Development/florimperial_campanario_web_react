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
import { getAllAvailableReservations, getReservationGolf } from '../utils/client';
import CirculoCarga from '../components/CirculoCarga';


export default function Reservations(props) {
    const [newSlotStart, setNewSlotStart] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [reservationsData, setReservationsData] = useState([]);
    const [loading, setLoading] = useState(true);
    let calendarData = [];
    useEffect(async() => {
        setLoading(true);
        
        let data = [];
        switch (props.module) {
            
            case 'golf':
                data = await getAllAvailableReservations('golf');
                break;

            case 'gym':
                data = await getAllAvailableReservations('gym');
                break;

            case 'raqueta':
                data = await getAllAvailableReservations('raqueta');
                break;

            case 'pool':
                data = await getAllAvailableReservations('pool');
                break;
                
        }

        setReservationsData(data);
        calendarData = data;
       
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
            
                {console.log('Data rendered', reservationsData)}
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
} 