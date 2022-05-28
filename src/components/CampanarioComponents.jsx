import React, { useState } from 'react';

export function Guests(props) {
    const deleteGuest = (index) => {
		let guestsCopy = [...props.guests];
		guestsCopy.splice(index, 1);
		props.setGuests(guestsCopy);
	}
	
	return (
        <div>
            <div>
                <p>{props.text}</p>
            </div>
			<div  
				onClick={() => deleteGuest(props.index)}>
					<p>-</p>
			</div>
        </div>
    )
}