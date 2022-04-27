import './profile.css';
import account_image from '../../images/avatar.png';
import camera from '../../images/camera-solid.svg';
import UserService from '../../services/user.service';
import level_up from '../../images/level_up.svg';
import rank from '../../images/rank.svg';
import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom"
import axios from "axios";
// import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
// import {createTheme} from '@mui/material/styles';
import trophy_image from "../../images/trophy.svg";
import pong_image from "../../images/pong-icon.svg";
import lose_image from "../../images/lose-icon.svg";
// import { userInfo } from 'os';
import TimeAgo from 'react-timeago';

function Profile() {

  const [unauthorized, setUnauthorized] = useState(false);
  const [user, setUser] = useState({
      username: '',
      img: '',
      email: '',
      id: 0,
  });

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
          }
          catch(err){if(mounted) setUnauthorized(true);}
      }
      getUser();
      return () => {mounted = false;}
  }, []);


  if (unauthorized)
      return <Redirect to={'/'}/>;


  return (
    <>
        <div className="bigOne">
            
            <div className="img-holder">
                <button className="btn"> <img src={camera} alt="account" id="camera"/></button>
            </div>
            <div className="conteneur-info">
                 {/* <div id="title"><h1>Profil</h1></div> */}


                <img src={account_image} alt="account" id="acc-img"/>

                <div className="login">
                    <h1>{user.username}</h1> 
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

    </>
  );
}

function Amis() {
    let online = 0;
    return (
        <>
        
            <div className="amis">
                <div id="title"><h1>Amis</h1></div>
                <h1 id='info-online'>En ligne</h1>
                <h1 id='info-offline'>hors ligne</h1>
                {online == 0 ? (
                    <h1> Rayane  </h1> 
                 ) : (
                    <h1> Elias </h1>
                )}
                    
                

            </div>
        </>
    );
}

function Stats() {
    return (
        <>
            <div className="stats">
                <div id="title"><h1>STATISTIQUES</h1></div>
                <section className="things">
                    <div className="ico">
                        <img src={pong_image} alt="pong" id="pong"/>
                        <h1 id="games">45</h1>
                        <span id="games"><h2>Games</h2></span>
                    </div>
                    <div className="ico">
                        <img src={trophy_image} alt="trophy" id="trophy"/>
                        <h1 id="victory">24</h1>
                        <span id="victory"><h2>Victories</h2></span>
                    </div>
                    <div className="ico">
                        <img src={lose_image} alt="lose" id="lose"/>
                        <h1 id="defeat">13</h1>
                        <span id="defeat"><h2>Defeats</h2></span>
                    </div>
                </section>
            </div>
        </>
    );
}


function History(props: any) {
        return (
        <>
            <div className="history">
                <div id="title"><h1>HISTORIQUE</h1></div>
                <Game user={props.user} color="#25b62ca8"/>
                <Game user={props.user} color="#bd2148f8"/>
            </div>
        </>
    );
}

function Game(props: any) {
    const color = {backgroundColor: props.color };
    const year = new Date();
    
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
                    <h1>100 / 055555500</h1>
                </div>
                <div className="login_2">
                    <h1>{props.user.username}</h1>
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