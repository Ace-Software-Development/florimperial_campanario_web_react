import React, { useState, useEffect } from 'react';
import { getAllActiveUsers } from '../utils/client';
import { Guests } from './CampanarioComponents';

export default function GuestsSection(props) {
    //Invitados
	const [guest, setGuest] = useState("");
    const [partnersList, setPartnersList] = useState([]);
    const maxGuests = props.maxGuests;
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
    }, [])

    /* Se agregan invitado a la lista unicamente si no se ha alcanzado el máximo de invitados */
    const handleAddGuests = () => {
        if(props.guests.length < maxGuests && guest != null){
            let guestDic = {id: "", username: guest}
            props.setGuests([...props.guests, guestDic]);
            setGuest(null);
        }else if(guest == null){
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
            setGuest(null);
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
        console.log(i.username.toLowerCase(), guest.nativeEvent.data);
        if(!guestsSet.has(i.id)){
            return i.username.toLowerCase().includes(guest.nativeEvent.data.toLowerCase());
        }else{
            return false;
        }
    }

    return (
        /* Agrega los invitados */
        <div>
            <h3>Agrega más socios o invitados</h3>
            <p>Máximo de invitados: {maxGuests}</p>

            {/* Partners list */}
            {guest ? (
                <div>
                    <div>
                        {
                            partnersList.filter(i => filterPartners(i)).map(index => {
                                return (
                                        <div
                                            key={index.id}
                                            onClick={() => handleAddPartners(index)}>
                                                <p>{index.username}</p>
                                        </div>
                                )
                            })
                        }
                    </div>
                </div>
                    ) : null}

            <div>
                <input 
                    type="text"
                    placeholder={'Escribe el nombre del invitado'}
                    value={guest}
                    onChange={text => setGuest(text)}
                />
                <div onClick={() => handleAddGuests()}>
                    <div>
                        <p>+</p>
                    </div>
                </div>
            </div>

            <div>
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
                        />
                        )
                })
                }
            </div>
        </div>
    );
}