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

export default function ReservationsClinicas(props) {
    const [newSlotStart, setNewSlotStart] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [reservationsData, setReservationsData] = useState([]);
    const [loading, setLoading] = useState(true);

	return (
		<Screen title={props.screenTitle} screenPath={props.screenPath}>
			
		</Screen>
	);
}
