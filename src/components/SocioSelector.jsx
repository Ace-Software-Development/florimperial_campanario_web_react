import { useState, useEffect } from 'react';
import { getAllActiveUsers } from '../utils/client';
import '../css/SocioSelector.css';

export default function SocioSelector(props) {
	const [partnersList, setPartnersList] = useState([]);
	const [selectedUser, setSelectedUser] = useState(props.defaultValue ? props.defaultValue : null);
	const [user, setUser] = useState(selectedUser ? selectedUser.username : '');
	const [focused, setFocused] = useState(false);

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

	const filterPartners = u => {
		let partnersSet = new Set();
		if(!partnersSet.has(u.id))
			return u.username.toLowerCase().includes(user.toLowerCase());
		else
			return false;
	};

	const handleInputChange = () => {
		if (selectedUser)
			setUser(selectedUser.username);
		else 
			setUser('');
		setFocused(false);
	};

	const handleSetPartner = id => {
		const newSelectedUser = partnersList.find(i => i.id == id);
		setSelectedUser(newSelectedUser);
		setUser(newSelectedUser.username);
		setFocused(false);
	};

	useEffect(() => {
		props.onChange(selectedUser);
	}, [selectedUser])
	
	return(
		<div className="input-users-container" onBlur={handleInputChange}>
			{/* Partners list */}
				{user && focused ? (
					<div className="suggested-users-container">
						{
							partnersList.filter(user => filterPartners(user)).map(user => {
								return (
										<div className="suggested-user" key={user.id}
											onMouseDown={event => handleSetPartner(event.target.dataset.id)}>
											<p data-id={user.id}>{user.username}</p>
										</div>
								)
							})
						}
					</div>
						) : null}
			<input 
				className="input user-text-input"
				type="text"
				placeholder="Nombre del socio"
				value={user}
				onChange={text => setUser(text.target.value)}
				onFocus={() => setFocused(true)}
			/>
		</div>
	);
}
