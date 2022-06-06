import Sidebar from './Sidebar';
import Header from './Header';

export default function Screen(props) {
  let header = '';
  if (props.title === 'none') {
    header = (
      <div style={{flexGrow: 1, padding: '1rem', overflowY: 'scroll'}}>{props.children}</div>
    );
  } else {
    header = (
      <div style={{flexGrow: 1, padding: '1rem', overflowY: 'scroll'}}>
        <Header processName={props.title} />
        {props.children}
      </div>
    );
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row', height: '100vh'}}>
      <Sidebar permissions={props.permissions} />
      {header}
    </div>
  );
}
