import * as React from 'react';
import Paper from '@mui/material/Paper';
import Parse from "parse";
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';

import {
    Scheduler,
    DayView,
    WeekView,
    Appointments,
    AppointmentForm,
    AppointmentTooltip,
    EditRecurrenceMenu,
    Toolbar,
    ViewSwitcher,
    CurrentTimeIndicator,
    ConfirmationDialog
} from '@devexpress/dx-react-scheduler-material-ui';

export default class SalidasGolf extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentDate: new Date(),
            updateInterval: 10000,

            addedAppointment: {},
            appointmentChanges: {},
            editingAppointment: undefined,
        };
        
        this.getGolfAppointments = this.getGolfAppointments.bind(this);
        this.commitChanges = this.commitChanges.bind(this);
        this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
        this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
        this.changeEditingAppointment = this.changeEditingAppointment.bind(this);
    }

    componentDidMount = async() => {
        try {
            this.setState({data: await this.getGolfAppointments()});
        } catch (error) {
            console.log(error);
        }
    }

    changeAddedAppointment(addedAppointment) {
        this.setState({ addedAppointment });
    }

    changeAppointmentChanges(appointmentChanges) {
        this.setState({ appointmentChanges });
    }

    changeEditingAppointment(editingAppointment) {
        this.setState({ editingAppointment });
    }

    commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
            let { data } = state;
            if (added) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }];
            }
            if (changed) {
                // Crear objeto de tipo Reservacion y ReservacionGolf
                // Settear sus atributos (numero de hoyos) 
                data = data.map(appointment => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
            }
            if (deleted !== undefined) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === deleted) {
                        const ReservacionGolf = new Parse.Object.extend("ReservacionGolf");
                        const Reservacion = new Parse.Object.extend("Reservacion");
                        const ReservacionInvitado = new Parse.Object.extend("ReservacionInvitado");

                        const golfAppointment = new ReservacionGolf();
                        const guestAppointment = new ReservacionInvitado();
                        const appointment = new Reservacion();

                        golfAppointment.set("id", deleted);
                        guestAppointment.set("reservacion", data[i].reservacion);
                        appointment.set("id", data[i].reservacion);

                        console.log(appointment.id);
                        golfAppointment.destroy().then(() => {
                            data = data.splice(i, 1);
                        }, (error) => {
                            console.log('No se pudo eliminar sorry');
                        });
                        // https://docs.parseplatform.org/js/guide/#distinct
                    }
                }
            }
            return { data };
        });
    }
    
    async getGolfAppointments() {
        const query = new Parse.Query('ReservacionGolf');
        query.include("reservacion");
        query.include(["reservacion.socio"]);

        const salidas = await query.find();
        const results = new Array();
        
        for (var i = 0; i < salidas.length; i++) {
            results.push({
                'id': salidas[i].id,
                'title': salidas[i].get("reservacion").get("socio").get("nombre"), 
                'startDate': salidas[i].get("reservacion").get("fechaInicio"),
                'reservacion': salidas[i].get("reservacion").id,
            });
        }

        return results;
    }

    render() {
        const {
            currentDate, 
            data, 
            addedAppointment, 
            appointmentChanges, 
            editingAppointment,
        } = this.state;
    
        return( 
            <Paper>
                <Scheduler
                data={data}
                height={660}
                >
                <ViewState 
                    currentDate={currentDate}
                />
                <EditingState
                    onCommitChanges={this.commitChanges}
                    addedAppointment={addedAppointment}
                    onAddedAppointmentChange={this.changeAddedAppointment}
                    appointmentChanges={appointmentChanges}
                    onAppointmentChangesChange={this.changeAppointmentChanges}
                    editingAppointment={editingAppointment}
                    onEditingAppointmentChange={this.changeEditingAppointment}
                />
                <WeekView
                    startDayHour={7}
                    endDayHour={19}
                />
                <DayView
                    startDayHour={7}
                    endDayHour={19}
                />
                <EditRecurrenceMenu />
                <ConfirmationDialog />
                <Appointments />
                <AppointmentTooltip
                    showOpenButton
                    showDeleteButton
                />
                <AppointmentForm />
                <Toolbar />
                <ViewSwitcher />
                <CurrentTimeIndicator
                    updateInterval={ this.updateInterval }
                />
                </Scheduler>
            </Paper>
        );
    }
}