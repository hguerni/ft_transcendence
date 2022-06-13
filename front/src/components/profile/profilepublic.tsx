import './profile.css';
import level_up from '../../images/level_up.svg';
import rank from '../../images/rank.svg';
import {useEffect, useState} from "react";
import {Redirect} from "react-router-dom"
import axios from "axios";
// import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
// import {createTheme} from '@mui/material/styles';
import trophy_image from "../../images/trophy.svg";
import pong_image from "../../images/pong-icon.svg";
import lose_image from "../../images/lose-icon.svg";
// import rond_vert from "../../images/icons8-green-circle-48.svg";
// import rond_rouge from "../../images/icons8-red-circle-48.png";
// import nitendo from "../../images/nitendo.svg";
import add_friend from "../../images/add-friend.png";
// import { userInfo } from 'os';
import TimeAgo from 'react-timeago';
// import { User } from '../../models/user.model';

function Profiles(props : any) {
  const [unauthorized, setUnauthorized] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [friendship, setFriendship] = useState({status: ""});
  const [user, setUser] = useState({
      online: 0,
      username: '',
      avatar: '',
      email: '',
      id: 0,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
      let mounted = true;

      const authorization = async () => {
          try { await axios.get('userData'); }
          catch(err){if(mounted) setUnauthorized(true);}
      }
      authorization();
      return () => {mounted = false;}
  }, []);
    //console.log(props.location.state.id);
  useEffect(() => {
      let mounted = true;
      const getUser = async () => {
          try {
              const {data} = await axios.get('user/ft/' + props.location.state.id);
              const  isfriend = (await axios.get('isfriend/' + props.location.state.id)).data;
              console.log(isfriend);
              if (mounted) setReady(true);
              if (mounted) setFriendship(isfriend)
              console.log(friendship.status)
              if (mounted) setUser(data);
              if (mounted) setAvatar(data.avatar);
          }
          catch(err){if(mounted) console.log("oof");}
      }
      getUser();
      return () => {mounted = false;}
  }, []);

  const handleClickAccept = () => {
    console.log("h");
    axios.get('addfriend/' + props.location.state.id);
  };

  const handleClickRevoke = () => {
    axios.get('removefriend/' + props.location.state.id);
  };


  if (unauthorized)
      return <Redirect to={'/'}/>;


  return (
    <>
        <div className="bigOne">

            <div className="conteneur-info">
                 {/* <div id="title"><h1>Profil</h1></div> */}


                <img src={avatar} alt="account" id="acc-img"/>

                <div className="login">
                    <h1>{user.username} {friendship.status === "" ?  (<button className="btncrayon" onClick={handleClickAccept}> <img src={add_friend} alt="account" id="crayon"/></button>) : (<button className="btncrayon" onClick={handleClickRevoke}><img src={add_friend} alt="account" id="crayon"/></button>)} </h1>
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
        <Stats id={props.location.state.id}/>
        <History id={props.location.state.id}/>

    </>
  );
}

// function Amis() {

//     const data : {nom: string, online: number}[] = [
//         {nom: "rayane", online: 1},
//         {nom: "elias", online: 0},
//         {nom: "pierre", online: 0},
//         {nom: "ava", online: 0},
//         {nom: "leo", online: 2}
//     ];
//     // let online = 0;
//     return (
//         <>

//             <div className="amis">

//                 <div id="title"><h1>Amis</h1></div>

//                {/* faire  une boucle ici qui check dabbord si les ami son en ligne */}

//                <h1 id='info-online'>Online</h1>
//                {data.map((element, i) => {
//                 //console.log(element);

//            // Affichage
//                 return (
//                     element.online !== 0 ? (

//                         element.online === 1 ? (
//                         <ul>
//                             <h1 id='texteh1'> <img src={rond_vert} alt="account" id="rondstatus" /> {element.nom} </h1>
//                         </ul>
//                         )
//                         :(
//                             <ul>
//                             <h1 id='texteh1'> <img src={nitendo} alt="account" id="rondstatus" /> {element.nom} </h1>
//                         </ul>
//                         )

//                     )
//                     : (
// ''
//                     )
//                 )

//                     })}
//                           <h1 id='info-offline'>Offline</h1>
//                {data.map((element, i) => {
//                 //console.log(element);

//            // Affichage
//                 return (
//                     element.online === 0 ? (


//                         <ul>
//                             <h1 id='texteh1'> <img src={rond_rouge} alt="account" id="rondstatus" /> {element.nom}</h1>
//                         </ul>

//                     )
//                     : (
// ''
//                     )
//                 )

//                     })}
//             </div>
//         </>
//     );
// }

function Stats(props: any) {
    const [games, setGetGames] = useState({n: 0, v: 0, d: 0});
    console.log(props.id)
    useEffect(() => {
        let mounted = true;
        const getFriends = async () => {
            try {
                const games = (await axios.get('user/stats/' + props.id)).data;
                //console.log(games);
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
    console.log(props.id)
    useEffect(() => {
        let mounted = true;
        const getStats = async () => {
            try {
                //console.log(props.user);
                const games = (await axios.get('user/games/' + props.id)).data;
                //console.log(games);
                if (mounted) setGetGames(games);
            }
            catch(err){}
        }
        getStats();
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
                                <li key={element.id}>
                                    <Game user={element.user} color="#25b62ca8" game={element}/>
                                </li>
                            ) : (
                                <li key={element.id}>
                                    <Game user={element.user} color="#bd2148f8" game={element}/>
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


export default Profiles;





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
//     //console.log(e.target.files);
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
