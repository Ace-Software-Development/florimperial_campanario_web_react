export function parseToEventObject(title, start, params={}) {
	// Consult https://fullcalendar.io/docs/event-parsing for more event parsing documentation
	
	return {
		id: start.getTime(),
		title: title,
		start: start,
		interactive: true
	}
}