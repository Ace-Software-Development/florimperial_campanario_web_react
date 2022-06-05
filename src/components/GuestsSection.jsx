import React, { useState, useEffect } from 'react';
import { getAllActiveUsers, getAllReservationGuests } from '../utils/client';
import { Guests } from './CampanarioComponents';
import '../css/GuestsSection.css';

export default function GuestsSection(props) {
    //Invitados
	const [guest, setGuest] = useState("");
    const [partnersList, setPartnersList] = useState([]);
    const maxGuests = props.maxGuests;
    const reservationId = props.reservationId;
	var pressed = 0;

    /* Get all Users from DB */
    useEffect(() => {
        getAllActiveUsers().then( response => {
            const data = [];
            response.forEach(i => {
                data.push({id: i.id, username: i.get('username')});
            });
            setPartnersList(data);
        });

        getAllReservationGuests(reservationId).then( response => {
            const addedGuests = [];
            response.forEach(i => {
                addedGuests.push({id: i.get("user") != undefined ? i.get("user").id : null, username: i.get("invitado").get("nombre")});
            });
            props.setGuests(addedGuests);
        })
    }, [])

    /* Se agregan invitado a la lista unicamente si no se ha alcanzado el máximo de invitados */
    const handleAddGuests = () => {
        if(props.guests.length < maxGuests && guest != ""){
            let guestDic = {id: "", username: guest}
            props.setGuests([...props.guests, guestDic]);
            setGuest("");
        }else if(guest == ""){
			pressed++;
			if(pressed > 5){
				window.alert('No se ha introducido ningún nombre')
				pressed = 0;
			}
		}else{
			window.alert('Ya no se pueden agregar mas invitados')
        }
    }

    /* Adds partners from DB to guests list if maxGuests hasn't been reached  */
    const handleAddPartners = (index) => {
        if (props.guests.length < maxGuests){
            let guestDic = {id: index.id, username: index.username}
            props.setGuests([...props.guests, {id: index.id, username: index.username}]);
            setGuest("");
        }else{
			window.alert('Ya no se pueden agregar mas invitados', [
				{text: 'Aceptar'}
			])
        }
    }

    /* Filters partners that aren't in list guests and that matches text written on text input */
    const filterPartners = (i) => {
        let guestsSet = new Set();
        for(let j of props.guests){
            if(j.id != undefined){
                guestsSet.add(j.id);
            }
        }

        if(!guestsSet.has(i.id)){
            return i.username.toLowerCase().includes(guest.toLowerCase());
        }else{
            return false;
        }
    }

    return (
        /* Agrega los invitados */
        <div className="guests-section">
            <p className="subtitle-2 guest-section-title">Agrega más socios o invitados</p>
            
            <div className="guests-container">
                {/* Partners list */}
                {guest ? (
                    <div className="suggested-guests-container">
                            {
                                partnersList.filter(i => filterPartners(i)).map(index => {
                                    return (
                                            <div className="suggested-guest"
                                                key={index.id}
                                                onClick={() => handleAddPartners(index)}>
                                                    <p>{index.username}</p>
                                            </div>
                                    )
                                })
                            }
                    </div>
                        ) : null}
                <div className="add-guest-container">
                    <input 
                        className="input guest-text-input"
                        type="text"
                        placeholder={'Nombre del socio o invitado'}
                        value={guest}
                        onChange={(text) => setGuest(text.target.value)}
                    />
                    <div onClick={() => handleAddGuests()}>
                        <div className="guest-add-btn">&#x2B;</div>
                    </div>
                </div>
            </div>

            <div className="guests-list-container">
                {/* Here goes the added guests */}
                {   
                props.guests.map((item, index) => {
                    return (
                        <Guests
                            key={index}
                            text={item.username}
                            index={index}
                            guests={props.guests}
                            setGuests={props.setGuests}
                            isPartner={item.id != "" ? true : false}
                        />
                        )
                })
                }
            </div>
        </div>
    );
}