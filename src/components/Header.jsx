import '../css/Dashboard.css';

function Header({processName}) {
    return (
      <header className="app-header">
        <h1 className="spacing">{processName}</h1>
      </header>
    );
};
export default Header;