import * as React from 'react';
import {useEffect, useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Parse from "parse";
import { ViewState } from '@devexpress/dx-react-scheduler';

import {
    Scheduler,
    WeekView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

export default function SalidasGolf() {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);

    async function getGolfAppointments() {
        // TODO
        // 1. Obtener reservaciones para esta semana nada mas...
        // 2. Arreglar la hora de la fechaInicio para que aparezca local o mexicana...
        // 3. La hora en Parse se guarda como UTC y ya al pasarla la convierte a local automaticamente... Entonces cuidar que al crear un horario desde la app se guarde
        // en utc en Parse para que al obtenerla si se ponga bien...
        const query = new Parse.Query('ReservacionGolf');
        query.include("reservacion");
        query.include(["reservacion.socio"]);
        const salidas = await query.find();
        const results = new Array();
        
        for (var i = 0; i < salidas.length; i++) {
            console.log(salidas[i].get("carritosReservados"));
            console.log(salidas[i].get("carritosNecesarios"));
            console.log(salidas[i].get("reservacion").get("fechaInicio"));
            console.log(salidas[i].get("reservacion").get("socio").get("nombre"));
            // console.log(salidas[i].get("socio").get("nombre"));
            // results.push({'title': salidas[i].get("socio").get("nombre"), 'startDate': salidas[i].get("fechaInicio")});
        }

        return [
            { title: 'Mail New Leads for Follow Up', startDate: '2022-04-13T10:00' },
            { title: 'Product Meeting', startDate: '2022-04-14T10:30', endDate: '2022-04-14T11:30' },
            { title: 'Send Territory Sales Breakdown', startDate: '2022-04-14T12:35' },
        ];

        // return results;
    }

    useEffect(async() => {
        try {
            setLoading(true);
            const salidas = await getGolfAppointments();
            setAppointments(salidas);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }, []);

    // const appointments = [
    //     { title: 'Mail New Leads for Follow Up', startDate: '2022-04-13T10:00' },
    //     { title: 'Product Meeting', startDate: '2022-04-14T10:30', endDate: '2022-04-14T11:30' },
    //     { title: 'Send Territory Sales Breakdown', startDate: '2022-04-14T12:35' },
    // ];
    const PREFIX = 'Demo';
    const classes = {
        todayCell: `${PREFIX}-todayCell`,
        weekendCell: `${PREFIX}-weekendCell`,
        today: `${PREFIX}-today`,
        weekend: `${PREFIX}-weekend`,
    };

    const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
        [`&.${classes.todayCell}`]: {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.14),
            },
            '&:focus': {
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
            },
        },
        [`&.${classes.weekendCell}`]: {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
            '&:hover': {
                backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
            },
            '&:focus': {
                backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
            },
        },
    }));

    const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(({ theme }) => ({
        [`&.${classes.today}`]: {
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
        [`&.${classes.weekend}`]: {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.06),
        },
    }));

    const TimeTableCell = (props) => {
        const { startDate } = props;
        const date = new Date(startDate);

        if (date.getDate() === new Date().getDate()) {
            return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />;
        } if (date.getDay() === 0 || date.getDay() === 6) {
            return <StyledWeekViewTimeTableCell {...props} className={classes.weekendCell} />;
        } return <StyledWeekViewTimeTableCell {...props} />;
    };

    const DayScaleCell = (props) => {
        const { startDate, today } = props;

        if (today) {
            return <StyledWeekViewDayScaleCell {...props} className={classes.today} />;
        } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
            return <StyledWeekViewDayScaleCell {...props} className={classes.weekend} />;
        } return <StyledWeekViewDayScaleCell {...props} />;
    };

    return(
        <Paper>
            <Scheduler
            data={appointments}
            height={660}
            >
            <ViewState />
            <WeekView
                startDayHour={9}
                endDayHour={19}
                timeTableCellComponent={TimeTableCell}
                dayScaleCellComponent={DayScaleCell}
            />
            <Appointments />
            </Scheduler>
        </Paper>
    );
}