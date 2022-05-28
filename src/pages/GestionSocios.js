import React from "react";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function GestionSocios() {
  return (
    <div className="App">
      <Sidebar/>
      <Header processName={"Gestión de socios"}/>
      <div></div>
    </div>
  );
}
