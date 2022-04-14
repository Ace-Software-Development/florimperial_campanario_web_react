import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './routes/Home';
import Auth from './routes/Auth';
import SalidasGolf from './routes/SalidasGolf';

export default function App() {
  return (
    <Router>
      <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/golf/salidas">
            <SalidasGolf />
          </Route>
          <Route path="/">
            <Auth />
          </Route>
        </Switch>
    </Router>
  );
}