import * as React from 'react';
import {useEffect, useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
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
            currentDate: '2022-04-17',
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
                data = data.map(appointment => (
                changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
            }
            if (deleted !== undefined) {
                data = data.filter(appointment => appointment.id !== deleted);
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
                'startDate': salidas[i].get("reservacion").get("fechaInicio")
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
                <DayView
                    startDayHour={7}
                    endDayHour={19}
                />
                <WeekView
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