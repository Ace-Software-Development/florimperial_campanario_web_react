export function parseToEventObject(title, start, params={}) {
	// Consult https://fullcalendar.io/docs/event-parsing for more event parsing documentation	
	return {
		id: start.getTime(),
		title: title,
		start: start,
		interactive: true
	}
}

export function changeDateToRecurringEvent(date) {
	return {
		start: date,
		daysOfWeek: [date.getDay()],
		startTime: date,
		startRecur: date,
	};
}

export function changeRecurringEventToDate(startDate, dayOfWeek, startTime, startRecur) {
	
}