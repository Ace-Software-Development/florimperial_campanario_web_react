// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import { ViewState } from '@devexpress/dx-react-scheduler';
// import {
//     Scheduler,
//     DayView,
//     Appointments,
// } from '@devexpress/dx-react-scheduler-material-ui';

// const SalidasGolf = () => {
//     const currentDate = '2018-11-01';
//     const schedulerData = [
//     { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
//     { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
//     ];

//     return(
//         <Paper>
//             <Scheduler
//                 data={schedulerData}
//             >
//             <ViewState
//                 currentDate={currentDate}
//             />
//             <DayView
//                 startDayHour={9}
//                 endDayHour={14}
//             />
//             <Appointments />
//             </Scheduler>
//         </Paper>
//     );
// };

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

const appointments = [
    { title: 'Mail New Leads for Follow Up', startDate: '2022-04-13T10:00' },
    { title: 'Product Meeting', startDate: '2022-04-14T10:30', endDate: '2022-04-14T11:30' },
    { title: 'Send Territory Sales Breakdown', startDate: '2022-04-14T12:35' },
];
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

const SalidasGolf = () => {
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
};

export default SalidasGolf;