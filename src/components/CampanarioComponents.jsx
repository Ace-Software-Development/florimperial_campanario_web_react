import React, { useState } from 'react';

export function Guests(props) {
    const deleteGuest = (index) => {
		let guestsCopy = [...props.guests];
		guestsCopy.splice(index, 1);
		props.setGuests(guestsCopy);
	}
	
	return (
        <div className="guest-container">
			{props.isPartner ? 
			<p className="guest-name">{props.text} (socio)</p> : <p className="guest-name">{props.text}</p>}
			<span className="guest-delete-btn" onClick={() => deleteGuest(props.index)}>
				&#x2715;
			</span>
        </div>
    )
}