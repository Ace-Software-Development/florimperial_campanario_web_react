import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import { initializeParse } from '@parse/react';

initializeParse(
  'https://parseapi.back4app.com/',
  'X8s3dRRQkpG2KmnfBYX3hX5FxmnSCe6DZbZX0DCh', //appID
  'Gw9xincpAKB6BoHC2KvdgZT753wIyXqkaHw0scXt' //JSKey
);


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
