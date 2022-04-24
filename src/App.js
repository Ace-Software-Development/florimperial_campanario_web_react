import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './routes/Home';
import Auth from './routes/Auth';
import Anuncios from './routes/Anuncios'
import DetalleAnun from './routes/DetalleAnun'
export default function App() {
  return (
    <Router>
      <Switch>
        
          <Route path="/home">
            <Home />
          </Route>

          <Route path= "/anuncios/:anuncioId" render={()=> {
           return (
            <div>
              <DetalleAnun/>
            </div>
          )
         }
         }    
         />
        
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