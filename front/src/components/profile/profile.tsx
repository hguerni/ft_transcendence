import './profile.css';
import camera from '../../images/camera-solid.svg';
import level_up from '../../images/level_up.svg';
import rank from '../../images/rank.svg';
import React, {ReactEventHandler, useEffect, useState} from "react";
import {Redirect, Link, useHistory} from "react-router-dom"
import axios from "axios";
// import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
// import {createTheme} from '@mui/material/styles';
import trophy_image from "../../images/trophy.svg";
import pong_image from "../../images/pong-icon.svg";
import lose_image from "../../images/lose-icon.svg";
import rond_vert from "../../images/icons8-green-circle-48.svg";
import rond_rouge from "../../images/icons8-red-circle-48.png";
import nitendo from "../../images/nitendo.svg";
import crayon from "../../images/crayon-de-couleur.png";
// import { userInfo } from 'os';
import TimeAgo from 'react-timeago';

function SearchUser () {
  const [user, setUser] = React.useState({
    online: 0,
    username: '',
    avatar: '',
    email: '',
    id: 0
  });

  const history = useHistory();

  const handleKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter"){
      let mounted = true
      const {data} = await axios.get('user/name/' + e.currentTarget.value);
      console.log(data);
      if (mounted && data) setUser(data);
      mounted = false;
    }
  };

  if (user.id !== 0) {
    let id  = user.id;
    history.push("/profiles", {id: user.id});
    user.id = 0;
  }

  return (
    <div className="search-user">
        <input
            id="input-bar"
            type="text"
            placeholder="Chercher un utilisateur"
            onKeyDown={handleKey}
        />
    </div>
    
  );
}

function Profile() {

  const [unauthorized, setUnauthorized] = useState(false);
  const [avatar, setAvatar] = useState('');
  const[modifyName, setModify] = useState(true);
  const[twofa, setToggle] = useState(false)
  const[activateTwoFa, setTwofa] = useState(false);
  const [user, setUser] = useState({
      username: '',
      avatar: '',
      email: '',
      id: 0,
      twofa: false
  });

   const hiddenFileInput = React.useRef<HTMLInputElement>(null);

   // Programatically click the hidden file input element
   // when the Button component is clicked
   const handleClick = () => {
     hiddenFileInput.current!.click();
   };

   const handleClickName = () => {setModify(false)}

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.checked) {
        target.checked = true;
        console.log(target.checked);
        setTwofa(true);
        setToggle(true)
    }
    else {
        console.log(target.checked);
        target.checked = false
        user.twofa = false;
        setUser(user);
        setToggle(false)
        axios.get("2fa/disable");
    }
  };

  const handleKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter"){
      let mounted = true
      user.username = e.currentTarget.value;
      await axios.put('update' , user);
      setUser(user);
      mounted = false;
      setModify(true);
    }
  };

   const upload = async (files: FileList | null ) => {
    if (files === null) return;

    const formData = new FormData();
    formData.append('image', files[0]);

    try {
        const {data} = await axios.post('user/upload', formData);
        await axios.put('updateAvatar', {avatar: data.url});
        setAvatar(data.url);
    }
    catch (err) {setAvatar('http://54.245.74.93:3030/uploads/avatar.png')}

    }

  useEffect(() => {
      let mounted = true;

      const authorization = async () => {
          try { await axios.get('userData'); }
          catch(err){if(mounted) setUnauthorized(true);}
      }
      authorization();
      return () => {mounted = false;}
  }, []);

  useEffect(() => {
      let mounted = true;
      const getUser = async () => {
          try {
              const {data} = await axios.get('userData')
              console.log(data);
              if (mounted) setUser(data);
              if (mounted) setAvatar(data.avatar);
              if (mounted) setToggle(data.twofa);
          }
          catch(err){if(mounted) setUnauthorized(true);}
      }
      getUser();
      return () => {mounted = false;}
  }, []);


  if (unauthorized)
      return <Redirect to={'/'}/>;

  if (activateTwoFa)
    return <Redirect to={'/activate2fa'}/>;

  return (
    <>
        
        <SearchUser/>
        <div className="bigOne">


            <div className="img-holder">
                <button className="btn" onClick={handleClick}> <img src={camera} alt="account" id="camera" title="Changer l'avatar"/></button>
                <input className="btn" type="file" ref={hiddenFileInput} hidden onChange={e => upload(e.target.files)} style={{display: 'none'}}/>
            </div>
            <div className="conteneur-info">
                 {/* <div id="title"><h1>Profil</h1></div> */}


                <img src={avatar} alt="account" id="acc-img"/>

                <div className="login">
                    <h1>{ modifyName ? user.username : <input
                        type="text"
                        placeholder="Search"
                        onKeyDown={handleKey}
                        /> } <button className="btncrayon" > <img src={crayon} alt="account" id="crayon" onClick={handleClickName}/></button></h1>
                </div>
                <div className="rank">
                    <h1>Rank <img src={rank} alt="account" id="rank-img"/> </h1>
                    <h1> 5 </h1>
                </div>
                <div className="level">
                    <h1>Level <img src={level_up} alt="account" id="level"/> </h1>
                    <h1> 30 </h1>
                </div>
            </div>
        </div>

        <Stats />
        <History user={user}/>
        <Amis />
        <div id="separation"></div>
        <div className="two-fa">
            <h1 id="two-fa-h1">Two-factor authentication</h1>
            <div className="tagrossemere">
                <label className="switch">
                    <input type="checkbox" checked={twofa} onChange={handleChange} />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>

    </>
  );
}

function Amis() {

    const [friends, setGetFriends] = useState([]);
    const [requests, setGetRequests] = useState([]);

    useEffect(() => {
        let mounted = true;
        const getFriends = async () => {
            try {
                const friends = (await axios.get('friends')).data;
                console.log(friends);
                if (mounted) setGetFriends(friends);
            }
            catch(err){}
        }
        getFriends();
        return () => {mounted = false;}
    }, []);

    useEffect(() => {
        let mounted = true;
        const getRequests = async () => {
            try {
                const frrequests = (await axios.get('friendrequests')).data;
                console.log(frrequests);
                if (mounted) setGetRequests(frrequests);
            }
            catch(err){}
        }
        getRequests();
        return () => {mounted = false;}
    }, []);

    const handleClick = (e : React.MouseEvent<HTMLElement>) => {
        const appMode = e.currentTarget.getAttribute('data-arg1');
        console.log(appMode);
        axios.get('acceptfriend/' + appMode?.toString());
      };

    return (
        <>

            <div className="amis">

                <div id="title"><h1>Amis</h1></div>

               {/* faire  une boucle ici qui check dabbord si les ami son en ligne */}

               <h1 id='info-online'>Online</h1>
               <ul>
               {friends.length ? friends.map((element : any) => {
                console.log(element);

           // Affichage
                return (
                    element.friend.online !== 2 ? (

                       element.friend.online === 0 ? (
                        <li key={element}>
                            <h1 id='texteh1'> 
                            <img src={rond_vert} alt="account" id="rondstatus" /> <Link to={{ pathname: "/profiles", state: {id: element.friend.id} }}> {element.friend.username} 
                            </Link></h1>
                        </li>
                        )
                        :(
                        <li key={element}>
                                                        <h1 id='texteh1'> 
                            <img src={nitendo} alt="account" id="rondstatus" /> <Link to={{ pathname: "/profiles", state: {id: element.friend.id} }}> {element.friend.username} 
                            </Link></h1>
                        </li>
                        )

                    )
                    : (
''
                    )
                )

                    }): 0}
                    </ul>
                          <h1 id='info-offline'>Offline</h1>
                          <ul>
               {friends.length ? friends.map((element: any) => {
                console.log(element);

           // Affichage
                return (
                   element.friend.online === 2 ? (


                        <li key={element}>
                            <h1 id='texteh1'> <img src={rond_rouge} alt="account" id="rondstatus" /> {element.friend.username}</h1>
                        </li>

                    )
                    : (
''
                    )
                )

                    }) : 0 }
                    </ul>
                        <h1 id='info-online'>Pending</h1>
                        <ul>
                        {requests.length ? requests.map((element: any) => {
                console.log(element);

           // Affichage
                return (
                        <li key={element}>
                            <h1 id='texteh1'> <img src={rond_rouge} alt="account" id="rondstatus" /> {element.friend.username}</h1>
                            <button className="btncrayon" onClick={handleClick} data-arg1={element.friend.id}><img src={crayon} alt="account" id="crayon"/></button>
                        </li>

                )

                    }) : 0}
                </ul>
            </div>
        </>
    );
}

function Stats() {
    const [games, setGetGames] = useState({n: 0, v: 0, d: 0});

    useEffect(() => {
        let mounted = true;
        const getFriends = async () => {
            try {
                const games = (await axios.get('stats')).data;
                console.log(games);
                if (mounted) setGetGames(games);
            }
            catch(err){}
        }
        getFriends();
        return () => {mounted = false;}
    }, []);

    return (
        <>
            <div className="stats">
                <div id="title"><h1>STATISTIQUES</h1></div>
                <section className="things">
                    <div className="ico">
                        <img src={pong_image} alt="pong" id="pong"/>
                        <h1 id="games">{games.n}</h1>
                        <span id="games"><h2>Games</h2></span>
                    </div>
                    <div className="ico">
                        <img src={trophy_image} alt="trophy" id="trophy"/>
                        <h1 id="victory">{games.v}</h1>
                        <span id="victory"><h2>Victories</h2></span>
                    </div>
                    <div className="ico">
                        <img src={lose_image} alt="lose" id="lose"/>
                        <h1 id="defeat">{games.d}</h1>
                        <span id="defeat"><h2>Defeats</h2></span>
                    </div>
                </section>
            </div>
        </>
    );
}


function History(props: any) {
    const [games, setGetGames] = useState([]);

    useEffect(() => {
        let mounted = true;
        const getFriends = async () => {
            try {
                const games = (await axios.get('games')).data;
                console.log(games);
                if (mounted) setGetGames(games);
            }
            catch(err){}
        }
        getFriends();
        return () => {mounted = false;}
    }, []);
    return (
        <>
            <div className="history">
                <div id="title"><h1>HISTORIQUE</h1></div>
                <ul>
                    {games.length ? games.map((element : any) => {
                        return (
                                element.winner === true ? (
                                <li key={element}>
                                    <Game user={props.user} color="#25b62ca8" game={element}/>
                                </li>
                            ) : (
                                <li key={element}>
                                    <Game user={props.user} color="#bd2148f8" game={element}/>
                                </li>
                            )
                        )}) : 0
                    }
                </ul>
            </div>
        </>
    );
}

function Game(props: any) {
    const color = {backgroundColor: props.color };
    const year = props.game.endGameTime;

    return (
        <>
            <div className="game" style={color}>
                <div className="date">
                    <TimeAgo date={year} id="time"/>
                </div>
                <div className="login_1">
                    <h1>{props.user.username}</h1>
                </div>
                <div className="score">
                    <h1>{props.game.userscore} / {props.game.adversaryscore}</h1>
                </div>
                <div className="login_2">
                    <h1>{props.game.adversary.username}</h1>
                </div>
            </div>
        </>
    );
}


export default Profile;





// // import React from 'react';
// // import { BrowserRouter, Route } from 'react-router-dom';
// import './profile.css';
// import React, { useState } from "react";
// // let account_image = require('../../images/avatar.png');
// import camera from '../../images/camera-solid.svg';

// function Profile() {
//   // let account_image = require('../../images/avatar.png');
//   // account_image = require('../../images/react-logo.png');

//   const [file, setFile] = useState('../../images/avatar.png');
//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     console.log(e.target.files);
//     setFile(URL.createObjectURL(e.target.files[0]));
//   }
//   return (
//     <div className="bigOne">
//     <div className="img-holder">
//       <input type="file" onChange={handleChange} />

//     </div>
//       {/* <div <button className="btn"> <img src={camera} alt="account" id="camera"/></button> </div> */}
//       <img src={file} alt="account" id="acc-img"/>
//       <h1>User.login ici</h1>
//     </div>
//   );
// }

// export default Profile;
