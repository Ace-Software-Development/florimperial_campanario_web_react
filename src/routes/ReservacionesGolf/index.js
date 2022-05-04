import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import SaveGolfAppointment from './saveGolfAppointment';
import EditGolfAppointment from './editGolfAppointment';
import moment from 'moment';

export default function ReservacionesGolf() {
    const [openSave, setOpenSave] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [reservacionGolfId, setReservacionGolfId] = useState("");
    const [titulo, setTitulo] = useState("Disponible");
    const [reservacionId, setReservacionId] = useState("");
    const [horaSalida, setHoraSalida] = useState(new Date());
    const [socioId, setSocioId] = useState("");
    const [maximoJugadores, setMaximoJugadores] = useState();
    const [hoyoSalidaId, setHoyoSalidaId] = useState();
    const [hoyoSalidaNombre, setHoyoSalidaNombre] = useState();
    const [hoyoUnoChecked, setHoyoUnoChecked] = useState(true);
    const [carritosReservados, setCarritosReservados] = useState(0);

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
                    let title = '';
                    
                    if (!reservaciones[i].get("reservacion").get("socio")) {
                        title = 'Disponible';
                    } else {
                        title = reservaciones[i].get("reservacion").get("socio").get("nombre");
                    }

                    results.push({
                        'id': reservaciones[i].id,
                        'title': title,
                        'start': reservaciones[i].get("reservacion").get("fechaInicio"),
                        'startString': reservaciones[i].get("reservacion").get("fechaInicio").toString(),
                        'reservacion': reservaciones[i].get("reservacion").id,
                        'socio': reservaciones[i].get("reservacion").get("socio"),
                        'maximoJugadores': reservaciones[i].get("reservacion").get("maximoJugadores"),
                        'hoyoSalida': reservaciones[i].get("reservacion").get("sitio"),
                        'carritosReservados': reservaciones[i].get("carritosReservados")
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

    const editAppointment = (eventClick)=> {
        const reservacionGolfId = eventClick.event._def.publicId;
        const titulo = eventClick.event._def.title;
        const reservacionId = eventClick.event._def.extendedProps.reservacion;
        const horaSalida = eventClick.event._def.extendedProps.startString;
        const socioId = eventClick.event._def.extendedProps.socio;
        const maximoJugadores = eventClick.event._def.extendedProps.maximoJugadores;
        const hoyoSalidaId = eventClick.event._def.extendedProps.hoyoSalida.id;
        const hoyoSalidaNombre = eventClick.event._def.extendedProps.hoyoSalida.attributes.nombre;
        const hoyoUnoChecked = (hoyoSalidaNombre == "Hoyo 1");

        setReservacionGolfId(reservacionGolfId);
        setTitulo(titulo);
        setReservacionId(reservacionId);
        setHoraSalida(horaSalida);
        setSocioId(socioId);
        setMaximoJugadores(maximoJugadores);
        setHoyoSalidaId(hoyoSalidaId);
        setHoyoSalidaNombre(hoyoSalidaNombre);
        setHoyoUnoChecked(hoyoUnoChecked);
        setOpenEdit(true);
    }

    return (
        <div>
            <FullCalendar
                plugins={[daygridPlugin, interactionPlugin]}
                dateClick={handleDateClick}
                events={appointments}
                dayCellContent={injectCellContent}
                eventClick={editAppointment}   
            />
            <SaveGolfAppointment open={openSave} onClose={setOpenSave} />
            <EditGolfAppointment 
                open={openEdit}
                onClose={setOpenEdit}
                reservacionGolfId={reservacionGolfId}
                titulo={titulo}
                reservacionId={reservacionId}
                horaSalida={horaSalida}
                socioId={socioId}
                maximoJugadores={maximoJugadores}
                hoyoSalidaId={hoyoSalidaId}
                hoyoSalidaNombre={hoyoSalidaNombre}
                hoyoUnoChecked={hoyoUnoChecked}
                carritosReservados={carritosReservados} />
        </div>
    )
}