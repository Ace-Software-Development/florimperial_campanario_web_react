import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './routes/Home';
import Auth from './routes/Auth';
import Anuncios from './routes/Anuncios'

export default function App() {
  return (
    <Router>
      <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/anuncios">
            <Anuncios />
          </Route>
          <Route path="/">
            <Auth />
          </Route>

         


        </Switch>
    </Router>
  );
}