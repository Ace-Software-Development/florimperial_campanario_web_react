import {useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom';
import Parse from 'parse';
import './Home.css'
import Sidebar from '../../components/Sidebar'
import {useParseQuery} from '@parse/react';
import ParseObject from 'parse/lib/browser/ParseObject';


export default function Home() {
  const [postText, setPostText] = useState('');
  const history = useHistory();
  //const parseQuery = new Parse.Query('Post');

  useEffect(() => {
    async function checkUser() {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        alert('You need to be logged in to access this page');
        history.push("/");
      }
    }
    checkUser();
  }, []);
  

  async function getPosts(){
  //const Post = Parse.Object.extend("Post");
  const query = new Parse.Query('Post');
  const Post = await query.find();
  const postArray = new Array();
  console.log(Post[0].get("text"));
 for (var i = 0; i < Post.length; i++){
    console.log(Post[i].get("text"));
    postArray.push(Post[i].get("text"));
  }
   //alert("Successfully retrieved " + Post.length + " posts.");


  return postArray;
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



  var items =  new Array();
  items = Array.from(getPosts());
  console.log("hola", items);
  return (
    
    <div className="App">
      <Sidebar/>
      <header className="app-header">
        <h1>Inicio</h1>
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
    </div>
  );
}