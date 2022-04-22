import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './routes/Home';
import Auth from './routes/Auth';
import ReservacionesGolf from './routes/ReservacionesGolf';

export default function App() {
  return (
    <Router>
      <Switch>
          <Route path="/golf/salidas">
            <ReservacionesGolf />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/">
            <Auth />
          </Route>
        </Switch>
    </Router>
  );
}