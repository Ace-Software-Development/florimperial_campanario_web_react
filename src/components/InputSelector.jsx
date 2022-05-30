import { useState, useEffect } from 'react';
import '../css/InputSelector.css';

export default function InputSelector(props) {
	const [dbList, setDbList] = useState([]);
	const [selectedElement, setSelectedElement] = useState(props.defaultValue ? props.defaultValue : null);
	const [displayText, setDisplayText] = useState(selectedElement ? props.getDisplayText(selectedElement) : '');
	const [focused, setFocused] = useState(false);

	/* Get all Users from DB */
	useEffect(() => {
		props.getListData().then(data => setDbList(data));
	}, [])

	const filterPartners = u => {
		let partnersSet = new Set();
		if(!partnersSet.has(u.id))
			return props.getDisplayText(u).toLowerCase().includes(displayText.toLowerCase());
		else
			return false;
	};

	const handleInputChange = () => {
		if (selectedElement)
			setDisplayText(props.getDisplayText(selectedElement));
		else 
			setDisplayText('');
		setFocused(false);
	};

	const handleSetPartner = id => {
		const newSelectedUser = dbList.find(i => i.id == id);
		setSelectedElement(newSelectedUser);
		setDisplayText(props.getDisplayText(newSelectedUser));
		setFocused(false);
	};

	useEffect(() => {
		props.onChange(selectedElement);
	}, [selectedElement])
	
	return(
		<div className="input-elements-container" onBlur={handleInputChange}>
			{/* Partners list */}
				{displayText && focused ? (
					<div className="suggested-elements-container">
						{
							dbList.filter(element => filterPartners(element)).map(element => {
								return (
										<div className="suggested-element" key={props.getElementId(element)}
											onMouseDown={event => handleSetPartner(event.target.dataset.id)}>
											<p data-id={props.getElementId(element)}>{props.getDisplayText(element)}</p>
										</div>
								)
							})
						}
					</div>
						) : null}
			<input 
				className="input"
				type="text"
				placeholder={props.placeholder}
				value={displayText}
				onChange={text => setDisplayText(text.target.value)}
				onFocus={() => setFocused(true)}
			/>
		</div>
	);
}
