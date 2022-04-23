// import React from 'react';
// import { BrowserRouter, Route } from 'react-router-dom';
import './profile.css';
import account_image from '../../images/avatar.png';
import camera from '../../images/camera-solid.svg';
import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom"
import axios from "axios";
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
// import {createTheme} from '@mui/material/styles';

function Profile() {

  const [unauthorized, setUnauthorized] = useState(false);
  const [user, setUser] = useState({
      username: '',
      img: '',
      email: '',
      id: 0,
      pendingInvite: false,
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

            <img src={account_image} alt="account" id="acc-img"/>
            <h1>{user.username}</h1>
            <h1>  </h1>
        </div>
        <Stats />
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
                        <VideogameAssetIcon 
                            sx={{
                                width: 200,
                                height: 200,
                            }}
                        />
                        <h1 id="games">45</h1>
                        <span id="games"><h2>Games played</h2></span>
                    </div>
                    <div className="ico">
                        <EmojiEventsIcon 
                            sx={{
                                color: '#ffc107',
                                width: 200,
                                height: 200,
                            }}
                        />
                        <h1 id="victory">24</h1>
                        <span id="victory"><h2>Victories</h2></span>
                    </div>
                </section>
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