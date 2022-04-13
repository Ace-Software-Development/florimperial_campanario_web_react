import {useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom';
import Parse from 'parse';
import './Home.css'
import {useParseQuery} from '@parse/react';
import ParseObject from 'parse/lib/browser/ParseObject';

export default function Home() {
  const history = useHistory();

  async function getAnuncios() {
    const query = new Parse.Query('Anuncio');
    // query donde noe sten eliminados
    const anuncios = await query.find();
    const postArray = new Array();
    
    for (var i = 0; i < anuncios.length; i++){
      console.log(anuncios[i].get("titulo"));
      postArray.push(anuncios[i].get("titulo"));
    }

    return anuncios;
  }

  const loadPage = () => {
    const [anuncios, setAnuncios] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function checkUser() {
        const currentUser = await Parse.User.currentAsync();
        if (!currentUser) {
          alert('Necesitas haber ingresado al sistema para consultar esta página.');
          history.push('/');
        }
      }
      
      checkUser();

      try {
        setLoading(true);
        const anuncios = await getAnuncios();
        setAnuncios(anuncios);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }, []);

    return (
      <div> Hola </div>
    )
  }

  
  const handleSubmitPost = (e) => {
    e.preventDefault();
    const Post = Parse.Object.extend("Post");
    const newPost = new Post();
    newPost.save()
    .then((newPost) => {
      // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + newPost.text);
    }, (error) => {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    });
    setPostText("");
  };

  // var items =  new Array();  
  // items = anunciosGlobal.map((anuncio) =>
  //   <li>{ anuncio }</li>
  // );
  

  return (
    <div className="App">
      <header className="app-header">
      <img className="logo" alt="back4app's logo" src={'https://blog.back4app.com/wp-content/uploads/2019/05/back4app-white-logo-500px.png'} />
        <h2 className="spacing">parseaaa hooks</h2>
        <span>social network</span>
      </header>
      
      <div className="posts-container">
        <form onSubmit={handleSubmitPost}className="actions">
          <textarea value={postText} onChange={event => setPostText(event.currentTarget.value)}/>
          <button type="submit">post</button>
          <ul>
            {items.map((item,index)=>{
              <li key={index}>{item}</li>
            })}
          </ul>
        </form>
      </div>
      <div>
        <ul> { items } </ul>
      </div>
    </div>
  );
}
