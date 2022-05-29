import Sidebar from './Sidebar';
import Header from './Header';

export default function Screen(props){
	return (
		<div style={{display:'flex',flexDirection:'row', height: '100vh'}}>
			<Sidebar />
			<div style={{flexGrow:1, padding: '2rem', overflowY: 'scroll'}}>
				<Header processName={props.title}/>
				{props.children}
			</div>
		</div>
	);
}
