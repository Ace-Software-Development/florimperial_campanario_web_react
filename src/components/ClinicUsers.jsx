import React, { useState, useEffect } from 'react';
import { getAllActiveUsers, getAllMultipleReservations } from '../utils/client';
import { Guests } from './CampanarioComponents';
import '../css/GuestsSection.css';

export default function ClinicUsers(props) {
    //Invitados
	const [guest, setGuest] = useState("");
    const [partnersList, setPartnersList] = useState([]);
    const maxGuests = props.maxUsers;
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
    }, []);

    /* Adds partners from DB to guests list if maxGuests hasn't been reached  */
    const handleAddPartners = (index) => {
        if (props.users.length < maxGuests){
            let guestDic = {id: index.id, username: index.username}
            props.setUsers([...props.users, {id: index.id, username: index.username}]);
            setGuest('');
        }else{
			window.alert('Ya no se pueden agregar mas invitados', [
				{text: 'Aceptar'}
			])
        }
    }

    /* Filters partners that aren't in list guests and that matches text written on text input */
    const filterPartners = (i) => {
        let guestsSet = new Set();
        for(let j of props.users){
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
            <p className="subtitle-2 guest-section-title">Socios que han reservado</p>
            
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
                        placeholder={'Nombre del socio'}
                        value={guest}
                        onChange={(text) => setGuest(text.target.value)}
                    />
                </div>
            </div>

            <div className="guests-list-container">
                {/* Here goes the added guests */}
                {   
                props.users.map((item, index) => {
                    return (
                        <Guests
                            key={index}
                            text={item.username}
                            index={index}
                            guests={props.users}
                            setGuests={props.setUsers}
                            isPartner={item.id != "" ? true : false}
                        />
                        )
                })
                }
            </div>
        </div>
    );
}