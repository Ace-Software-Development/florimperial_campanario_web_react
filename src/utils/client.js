import Parse from 'parse';

export async function getAllGolfAppointmentSlots(){
	try {
		const query = new Parse.Query('Reservacion');
		query.include('user')
		return await query.find();
		
	} catch (error) {
		console.log(`Ha ocurrido un error: ${ error }`);
		return null;
	}
}