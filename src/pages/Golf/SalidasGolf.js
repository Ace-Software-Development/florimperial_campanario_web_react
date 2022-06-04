import React, {useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CreateGolfAppointmentSlot from './CreateGolfAppointmentSlot';
import EditGolfAppointmentSlot from './EditGolfAppointmentSlot';
import esLocale from '@fullcalendar/core/locales/es';
import CirculoCarga from '../../components/CirculoCarga';
import Screen from '../../components/Screen';
import {getAllGolfAppointmentSlots} from '../../utils/client';

// Permissions
import {useHistory} from 'react-router-dom';
import {checkUser} from '../../utils/client';

export default function SalidasGolf() {
  const [appointments, setAppointments] = useState([]);
  const [newSlotStart, setNewSlotStart] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // Permissions
  const history = useHistory();
  const [permissions, setPermissions] = useState({});

  useEffect(async () => {
    setLoading(true);

    // PErmissions
    const permissionsJson = await checkUser();
    if (permissionsJson === 'NO_USER') {
      alert('Necesitas haber ingresado al sistema para consultar esta página.');
      history.push('/');
    } else if (permissionsJson === 'NOT_ADMIN') {
      alert('Necesitas ser administrador para acceder al sistema.');
      history.push('/');
    } else if (permissionsJson === 'INVALID_SESSION') {
      alert('Tu sesión ha finalizado. Por favor, inicia sesión nuevamente.');
      history.push('/');
    }
    setPermissions(permissionsJson);
    try {
      setLoading(true);
      const permissionsJson = await checkUser();
      setPermissions(permissionsJson);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }

    // Reservations
    const appointments = await getAllGolfAppointmentSlots();
    const resultados = [];
    appointments.forEach(appointment => {
      resultados.push({
        objectId: appointment.id,
        id: appointment.id,
        title:
          appointment.get('user') === undefined || appointment.get('estatus') === 1
            ? 'Disponible'
            : appointment.get('user').get('username'),
        start: appointment.get('fechaInicio'),
        estatus: appointment.get('estatus'),
        maximoJugadores: appointment.get('maximoJugadores'),
        sitio: {
          objectId: appointment.get('sitio').id,
          nombre: appointment.get('sitio').get('nombre'),
          tableName: 'Sitio',
        },
        profesor: appointment.get('profesor')
          ? {
              objectId: appointment.get('profesor').id,
              nombre: appointment.get('profesor').get('nombre'),
              tableName: 'Profesor',
            }
          : null,
        user: appointment.get('user')
          ? {
              objectId: appointment.get('user').id,
              username: appointment.get('user').get('username'),
              tableName: 'User',
            }
          : null,
      });
    });
    setAppointments(resultados);
    setLoading(false);
    return;
  }, []);

  const addAppointmentSlot = dateClickInfo => {
    setNewSlotStart(dateClickInfo.date);
    setOpenCreate(true);
  };

  const editAppointment = eventClick => {
    const id = eventClick.event._def.publicId;
    setSelectedAppointment(appointments.find(row => row.objectId == id));
    setOpenEdit(true);
  };

  if (loading) return <CirculoCarga />;

  return (
    <Screen title="Reservaciones de Golf" permissions={permissions}>
      <FullCalendar
        locale={esLocale}
        dateClick={addAppointmentSlot}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        views={{
          customMonth: {
            buttonText: 'Mes',
          },
          customWeek: {
            buttonText: 'Semana',
          },
          customDay: {
            buttonText: 'Día',
            minute: 'numeric',
          },
        }}
        headerToolbar={{
          left: 'today prev,next',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,timeGridDay',
        }}
        initialView="dayGridMonth"
        events={appointments}
        eventClick={editAppointment}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
          hour12: true,
        }}
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
          hour12: true,
        }}
      />

      {openEdit && (
        <div>
          <script src="fullcalendar/lang/es.js"></script>
          <EditGolfAppointmentSlot
            open={openEdit}
            onClose={setOpenEdit}
            appointmentData={selectedAppointment}
          />
        </div>
      )}

      {openCreate && (
        <CreateGolfAppointmentSlot
          open={openCreate}
          onClose={setOpenCreate}
          startingDate={newSlotStart}
        />
      )}
    </Screen>
  );
}
