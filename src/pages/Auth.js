import "../css/Auth.css";
import React, { useState } from "react";
import Parse from "parse";
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css' 

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
      if (user.attributes.isAdmin == false) {
        alert(
          "Necesitas ser administrador para acceder al sistema."
        );
        Parse.User.logOut().then(() => {
          const user = Parse.User.current();  // this will now be null
        });
        }
        else {
      history.push('/home');
      }
    }).catch(err => {
      alert(err.message);
    });
  }

  return (
    <section className="vh-100" style={{ background: '#508bfc' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong">
              <div className="card-body p-5 text-center"> 
                <h3 className="mb-5">Iniciar sesión</h3>
                <form className="auth-form" onSubmit={ logIn }>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="username">No. Nómina</label>
                    <input 
                      type="text" 
                      name="username"
                      id="username"
                      value={ username }
                      onChange={ (e) => setUsername(e.target.value) }
                      className="form-control form-control-lg" 
                      />
                  </div>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="password">Contraseña</label>
                    <input 
                      type="password" 
                      name="password" 
                      id="password" 
                      value={ password } 
                      onChange={ (e) => setPassword(e.target.value) }
                      className="form-control form-control-lg" 
                      />
                  </div>
                  <div> </div>
                  <button className="btn btn-primary btn-lg btn-block" type="submit" name="action" id="enviar">Iniciar sesión</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;