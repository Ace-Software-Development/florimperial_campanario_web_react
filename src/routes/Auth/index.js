import "./Auth.css";
import React, { useState } from "react";
import Parse from "parse";
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css' 
import Logo from '../../img/logo-campanario-azul.png';

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const logIn = (e) => {
    e.preventDefault();

    const user = new Parse.User();
    user.set('username', username);
    user.set('password', password);

    user.logIn().then((user) => {
      history.push('/home');
    }).catch(err => {
      alert(err.message);
    });
  }

  return (
    <section className="vh-100" style={{ background: '#fafafa' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong" style={{ background: '#ebebeb'}}>
              <div className="card-body p-5 text-center"> 
                <img className="logo-campanario "src={Logo} alt="Logo" />
                <form className="auth-form" onSubmit={ logIn }>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="username"></label>
                    <input 
                      type="text" 
                      name="username"
                      id="username"
                      value={ username }
                      onChange={ (e) => setUsername(e.target.value) }
                      className="form-control form-control-lg" 
                      placeholder="Número de nomina"
                      />
                  </div>
                    <label className="form-label" htmlFor="password"></label>
                    <input 
                      type="password" 
                      name="password" 
                      id="password" 
                      value={ password } 
                      onChange={ (e) => setPassword(e.target.value) }
                      className="form-control form-control-lg" 
                      placeholder="Contraseña"
                      />
                  <div> </div>
                  <button className="btn btn-primary btn-lg btn-block" type="submit" name="action" id="enviar">Iniciar sesión</button>
                </form>
              </div>
              <a className="recuperar-contrasena" href="#"> ¿Olvidaste tu contraseña?</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;